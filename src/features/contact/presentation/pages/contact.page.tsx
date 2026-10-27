import { useState, type FormEvent } from "react";
import "../../../../core/layout/style/static.page.css";

// ---------- informacion de contacto ----------
const CONTACT_EMAIL = "contacto@watchnext.example";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactErrors = {
  nombre: string | null;
  correo: string | null;
  mensaje: string | null;
};

// ---------- validacion de campos ----------
function validarNombre(valor: string): string | null {
  if (!valor.trim()) return "El nombre es obligatorio.";
  if (valor.trim().length > 100) return "El nombre no puede superar 100 caracteres.";
  return null;
}

function validarCorreo(valor: string): string | null {
  const correo = valor.trim();
  if (!correo) return "El correo es obligatorio.";
  if (correo.length > 100) return "El correo no puede superar 100 caracteres.";
  if (!EMAIL_REGEX.test(correo)) return "El correo no tiene un formato válido.";
  return null;
}

function validarMensaje(valor: string): string | null {
  if (!valor.trim()) return "El mensaje es obligatorio.";
  if (valor.length > 500) return "El mensaje no puede superar 500 caracteres.";
  return null;
}

export function ContactPage() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [errores, setErrores] = useState<ContactErrors>({
    nombre: null,
    correo: null,
    mensaje: null,
  });

  // ---------- actualizar y validar campos ----------
  function actualizarNombre(valor: string) {
    setNombre(valor);
    setEnviado(false);
    setErrores((actuales) => ({ ...actuales, nombre: null }));
  }

  function actualizarCorreo(valor: string) {
    setCorreo(valor);
    setEnviado(false);
    setErrores((actuales) => ({ ...actuales, correo: null }));
  }

  function actualizarMensaje(valor: string) {
    setMensaje(valor);
    setEnviado(false);
    setErrores((actuales) => ({ ...actuales, mensaje: null }));
  }

  function validarNombreCampo() {
    setErrores((actuales) => ({ ...actuales, nombre: validarNombre(nombre) }));
  }

  function validarCorreoCampo() {
    setErrores((actuales) => ({ ...actuales, correo: validarCorreo(correo) }));
  }

  function validarMensajeCampo() {
    setErrores((actuales) => ({ ...actuales, mensaje: validarMensaje(mensaje) }));
  }

  function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // 1. validar todos los campos antes de registrar la consulta
    setEnviado(false);
    const nuevosErrores: ContactErrors = {
      nombre: validarNombre(nombre),
      correo: validarCorreo(correo),
      mensaje: validarMensaje(mensaje),
    };
    setErrores(nuevosErrores);
    if (Object.values(nuevosErrores).some(Boolean)) return;

    // 2. simular el envio y restablecer el formulario
    setNombre("");
    setCorreo("");
    setMensaje("");
    setEnviado(true);
  }

  return (
    <section className="static-page" aria-labelledby="contact-title">
      <header className="static-contact-heading">
        <h1 id="contact-title">Hablemos de WatchNext.</h1>
        <p className="static-lead">
          ¿Ideas para mejorar la plataforma, dudas sobre perfiles y listas o
          comentarios generales? Escríbenos y te leemos.
        </p>
      </header>

      <a className="static-email" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>

      <section className="static-contact-form-section" aria-labelledby="contact-form-title">
        <h2 id="contact-form-title">Déjanos tu mensaje</h2>
        <p className="static-contact-note">
          Cuéntanos tu duda o sugerencia y envíanos tu consulta.
        </p>
        <form className="static-contact-form" onSubmit={enviar} noValidate>
          <label htmlFor="contact-name">Nombre</label>
          <input
            className={`form-control${errores.nombre ? " is-invalid" : ""}`}
            id="contact-name"
            value={nombre}
            onChange={(event) => actualizarNombre(event.target.value)}
            onBlur={validarNombreCampo}
            maxLength={100}
            autoComplete="name"
            aria-invalid={Boolean(errores.nombre)}
            aria-describedby={errores.nombre ? "contact-name-error" : undefined}
            required
          />
          {errores.nombre && <p id="contact-name-error" role="alert" className="static-contact-error">{errores.nombre}</p>}

          <label htmlFor="contact-email">Correo electrónico</label>
          <input
            className={`form-control${errores.correo ? " is-invalid" : ""}`}
            id="contact-email"
            type="email"
            value={correo}
            onChange={(event) => actualizarCorreo(event.target.value)}
            onBlur={validarCorreoCampo}
            maxLength={100}
            autoComplete="email"
            aria-invalid={Boolean(errores.correo)}
            aria-describedby={errores.correo ? "contact-email-error" : undefined}
            required
          />
          {errores.correo && <p id="contact-email-error" role="alert" className="static-contact-error">{errores.correo}</p>}

          <label htmlFor="contact-message">Mensaje</label>
          <textarea
            className={`form-control${errores.mensaje ? " is-invalid" : ""}`}
            id="contact-message"
            rows={5}
            value={mensaje}
            onChange={(event) => actualizarMensaje(event.target.value)}
            onBlur={validarMensajeCampo}
            maxLength={500}
            aria-invalid={Boolean(errores.mensaje)}
            aria-describedby={errores.mensaje ? "contact-message-error" : undefined}
            required
          />
          {errores.mensaje && <p id="contact-message-error" role="alert" className="static-contact-error">{errores.mensaje}</p>}

          <span className="static-contact-counter">{mensaje.length}/500 caracteres</span>
          <button className="btn btn-primary" type="submit">Enviar consulta</button>
          {enviado && <p role="status" className="static-contact-success">Consulta enviada correctamente.</p>}
        </form>
      </section>
    </section>
  );
}
