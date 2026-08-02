"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import RichTextEditor from "./RichTextEditor";

const initialFields = {
  last_name: "",
  first_name: "",
  middle_name: "",
  birth_year: "",
  death_year: "",
  occupation: "",
  grave_section: "",
  direction_text: "",
  latitude: "",
  longitude: "",
};

export default function AdminForm() {
  const [fields, setFields] = useState(initialFields);
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [schemeFile, setSchemeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successGrave, setSuccessGrave] = useState(null);
  const [formKey, setFormKey] = useState(0); // used to reset file inputs

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  async function uploadFile(file, bucket) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  }

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
      let photo_url = null;
      let direction_scheme_url = null;

      if (photoFile) {
        photo_url = await uploadFile(photoFile, "grave-photos");
      }
      if (schemeFile) {
        direction_scheme_url = await uploadFile(schemeFile, "grave-directions");
      }

      const { data, error: insertError } = await supabase
        .from("graves")
        .insert({
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
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setSuccessGrave(data);
      setFields(initialFields);
      setDescription("");
      setPhotoFile(null);
      setSchemeFile(null);
      setFormKey((k) => k + 1); // remounts file inputs so they visually clear
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
          Поховання успішно додано!{" "}
          <Link href={`/grave/${successGrave.id}`}>Переглянути сторінку →</Link>
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
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSchemeFile(e.target.files[0])}
          style={{ display: "block", marginTop: "4px" }}
        />
      </label>

      <label>
        Широта (latitude) *
        <input
          name="latitude"
          value={fields.latitude}
          onChange={handleChange}
          placeholder="напр. 50.4501"
          style={inputStyle}
        />
      </label>

      <label>
        Довгота (longitude) *
        <input
          name="longitude"
          value={fields.longitude}
          onChange={handleChange}
          placeholder="напр. 30.5234"
          style={inputStyle}
        />
      </label>

      <button type="submit" disabled={submitting} style={buttonStyle}>
        {submitting ? "Додавання..." : "Додати поховання"}
      </button>
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
