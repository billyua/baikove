"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RichTextEditor from "./RichTextEditor";
import CoordinatePicker from "./CoordinatePicker";
import { buildGraveSlugBase } from "../lib/transliterate";

const DEFAULT_LATITUDE = 50.418671547541706;
const DEFAULT_LONGITUDE = 30.51021526307843;

function fieldsFromGrave(grave) {
  return {
    last_name: grave?.last_name || "",
    first_name: grave?.first_name || "",
    middle_name: grave?.middle_name || "",
    birth_year: grave?.birth_year ?? "",
    death_year: grave?.death_year ?? "",
    occupation: grave?.occupation || "",
    grave_section: grave?.grave_section || "",
    direction_text: grave?.direction_text || "",
    latitude:
      grave?.latitude != null ? String(grave.latitude) : DEFAULT_LATITUDE.toFixed(6),
    longitude:
      grave?.longitude != null ? String(grave.longitude) : DEFAULT_LONGITUDE.toFixed(6),
  };
}

async function uploadToCloudinary(file) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    throw new Error("Не вдалося завантажити зображення.");
  }

  const data = await res.json();
  return data.secure_url;
}

// mode: "create" | "edit". In edit mode, pass initialGrave (the current
// record) and currentSlug (its current URL slug, used to call the API).
export default function GraveForm({
  mode = "create",
  initialGrave = null,
  currentSlug = null,
}) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [fields, setFields] = useState(fieldsFromGrave(initialGrave));
  const [description, setDescription] = useState(initialGrave?.description || "");
  const [slug, setSlug] = useState(initialGrave?.slug || "");
  // In edit mode, don't silently rewrite an already-published URL as the
  // admin edits other fields — only change it if they touch the URL field.
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState(
    initialGrave?.photo_url || null
  );
  const [existingSchemeUrl, setExistingSchemeUrl] = useState(
    initialGrave?.direction_scheme_url || null
  );
  const [photoFile, setPhotoFile] = useState(null);
  const [schemeFile, setSchemeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successGrave, setSuccessGrave] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...fields, [name]: value };
    setFields(updated);

    if (
      !slugTouched &&
      (name === "last_name" || name === "birth_year" || name === "death_year")
    ) {
      setSlug(
        buildGraveSlugBase(updated.last_name, updated.birth_year, updated.death_year)
      );
    }
  };

  const handleSlugChange = (e) => {
    setSlugTouched(true);
    setSlug(e.target.value);
  };

  const handleMapMove = (lat, lng) => {
    setFields((prev) => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }));
  };

  async function handleDelete() {
    const confirmed = window.confirm(
      "Ви впевнені, що хочете видалити це поховання? Цю дію не можна скасувати."
    );
    if (!confirmed) return;

    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/graves/${currentSlug}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Не вдалося видалити.");
      router.push("/directory");
    } catch (err) {
      setError(err.message || "Сталася невідома помилка.");
      setSubmitting(false);
    }
  }

  const mapLatitude = Number.isFinite(parseFloat(fields.latitude))
    ? parseFloat(fields.latitude)
    : DEFAULT_LATITUDE;
  const mapLongitude = Number.isFinite(parseFloat(fields.longitude))
    ? parseFloat(fields.longitude)
    : DEFAULT_LONGITUDE;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccessGrave(null);

    if (
      !fields.last_name ||
      !fields.first_name ||
      !fields.latitude ||
      !fields.longitude
    ) {
      setError(
        "Заповніть обов'язкові поля: прізвище, ім'я та координати (широта і довгота)."
      );
      return;
    }

    setSubmitting(true);
    try {
      let photo_url = existingPhotoUrl;
      let direction_scheme_url = existingSchemeUrl;

      if (photoFile) {
        photo_url = await uploadToCloudinary(photoFile);
      }
      if (schemeFile) {
        direction_scheme_url = await uploadToCloudinary(schemeFile);
      }

      const payload = {
        last_name: fields.last_name,
        first_name: fields.first_name,
        middle_name: fields.middle_name || null,
        birth_year: fields.birth_year ? parseInt(fields.birth_year, 10) : null,
        death_year: fields.death_year ? parseInt(fields.death_year, 10) : null,
        occupation: fields.occupation || null,
        description: description || null,
        grave_section: fields.grave_section || null,
        photo_url,
        direction_text: fields.direction_text || null,
        direction_scheme_url,
        latitude: parseFloat(fields.latitude),
        longitude: parseFloat(fields.longitude),
        slug,
      };

      const url = isEdit ? `/api/graves/${currentSlug}` : "/api/graves";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Сталася помилка.");

      setSuccessGrave(data.grave);
      setExistingPhotoUrl(data.grave.photo_url);
      setExistingSchemeUrl(data.grave.direction_scheme_url);
      setPhotoFile(null);
      setSchemeFile(null);
      setFormKey((k) => k + 1);

      if (isEdit) {
        // If the URL changed, move the admin to the new edit URL.
        if (data.grave.slug !== currentSlug) {
          router.replace(`/grave/${data.grave.slug}/edit`);
        } else {
          router.refresh();
        }
      } else {
        setFields(fieldsFromGrave(null));
        setDescription("");
        setSlug("");
        setSlugTouched(false);
      }
    } catch (err) {
      setError(err.message || "Сталася невідома помилка.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "18px" }}
    >
      {error && (
        <p style={{ color: "red", padding: "10px", background: "#fee" }}>
          {error}
        </p>
      )}
      {successGrave && (
        <p style={{ color: "green", padding: "10px", background: "#efe" }}>
          {isEdit ? "Зміни збережено!" : "Поховання успішно додано!"}{" "}
          <Link href={`/grave/${successGrave.slug}`}>Переглянути сторінку →</Link>
        </p>
      )}

      <label>
        Прізвище *
        <input
          name="last_name"
          value={fields.last_name}
          onChange={handleChange}
          style={inputStyle}
        />
      </label>

      <label>
        Ім&apos;я *
        <input
          name="first_name"
          value={fields.first_name}
          onChange={handleChange}
          style={inputStyle}
        />
      </label>

      <label>
        По батькові
        <input
          name="middle_name"
          value={fields.middle_name}
          onChange={handleChange}
          style={inputStyle}
        />
      </label>

      <label>
        Рік народження
        <input
          name="birth_year"
          type="number"
          value={fields.birth_year}
          onChange={handleChange}
          style={inputStyle}
        />
      </label>

      <label>
        Рік смерті
        <input
          name="death_year"
          type="number"
          value={fields.death_year}
          onChange={handleChange}
          style={inputStyle}
        />
      </label>

      <label>
        Рід занять
        <input
          name="occupation"
          value={fields.occupation}
          onChange={handleChange}
          style={inputStyle}
        />
      </label>

      <label>
        URL сторінки (заповнюється автоматично, за потреби можна змінити)
        <input
          name="slug"
          value={slug}
          onChange={handleSlugChange}
          style={inputStyle}
        />
        <span style={{ fontSize: "13px", color: "#666" }}>
          Сторінка буде доступна за адресою: /grave/{slug || "..."}
          {isEdit && " (зміна URL зробить недійсними старі посилання)"}
        </span>
      </label>

      <label>
        Опис (можна додавати посилання, напр. на Вікіпедію)
        <div style={{ marginTop: "4px" }}>
          <RichTextEditor content={description} onChange={setDescription} />
        </div>
      </label>

      <label>
        Сектор могили
        <input
          name="grave_section"
          value={fields.grave_section}
          onChange={handleChange}
          style={inputStyle}
        />
      </label>

      <label key={`photo-${formKey}`}>
        Фото могили
        {existingPhotoUrl && (
          <div style={{ margin: "8px 0" }}>
            <img
              src={existingPhotoUrl}
              alt="Поточне фото"
              style={{ maxWidth: "200px", borderRadius: "6px", display: "block" }}
            />
            <span style={{ fontSize: "13px", color: "#666" }}>
              Поточне фото. Виберіть новий файл, щоб замінити.
            </span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhotoFile(e.target.files[0])}
          style={{ display: "block", marginTop: "4px" }}
        />
      </label>

      <label>
        Опис маршруту від головного входу (текст)
        <textarea
          name="direction_text"
          value={fields.direction_text}
          onChange={handleChange}
          rows={3}
          style={inputStyle}
        />
      </label>

      <label key={`scheme-${formKey}`}>
        Схема маршруту (зображення)
        {existingSchemeUrl && (
          <div style={{ margin: "8px 0" }}>
            <img
              src={existingSchemeUrl}
              alt="Поточна схема"
              style={{ maxWidth: "200px", borderRadius: "6px", display: "block" }}
            />
            <span style={{ fontSize: "13px", color: "#666" }}>
              Поточна схема. Виберіть новий файл, щоб замінити.
            </span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSchemeFile(e.target.files[0])}
          style={{ display: "block", marginTop: "4px" }}
        />
      </label>

      <div>
        <p style={{ margin: "0 0 8px", fontWeight: "bold" }}>
          Розташування могили *
        </p>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <label>
              Широта (latitude)
              <input
                name="latitude"
                value={fields.latitude}
                onChange={handleChange}
                style={inputStyle}
              />
            </label>
            <label>
              Довгота (longitude)
              <input
                name="longitude"
                value={fields.longitude}
                onChange={handleChange}
                style={inputStyle}
              />
            </label>
          </div>
          <div style={{ flex: "1 1 260px", maxWidth: "320px" }}>
            <CoordinatePicker
              latitude={mapLatitude}
              longitude={mapLongitude}
              onChange={handleMapMove}
            />
            <span style={{ fontSize: "13px", color: "#666" }}>
              Перемістіть карту, щоб позначка в центрі вказувала на могилу.
            </span>
          </div>
        </div>
      </div>

      <button type="submit" disabled={submitting} style={buttonStyle}>
        {submitting
          ? "Збереження..."
          : isEdit
          ? "Зберегти зміни"
          : "Додати поховання"}
      </button>

      {isEdit && (
        <div
          style={{
            marginTop: "20px",
            paddingTop: "20px",
            borderTop: "1px solid #ddd",
          }}
        >
          <button
            type="button"
            onClick={handleDelete}
            disabled={submitting}
            style={deleteButtonStyle}
          >
            Видалити поховання
          </button>
        </div>
      )}
    </form>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "8px",
  marginTop: "4px",
  boxSizing: "border-box",
  fontSize: "16px",
};

const buttonStyle = {
  padding: "12px",
  fontSize: "16px",
  backgroundColor: "#333",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const deleteButtonStyle = {
  padding: "10px 16px",
  fontSize: "14px",
  backgroundColor: "#fff",
  color: "#b3261e",
  border: "1px solid #b3261e",
  borderRadius: "6px",
  cursor: "pointer",
};
