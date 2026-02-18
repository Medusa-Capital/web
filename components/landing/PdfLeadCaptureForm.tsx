"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  COUNTRIES,
  isValidName,
  isValidEmail,
  isValidPhone,
  formatPhoneForSubmission,
} from "@/lib/validation";
import { trackEvent, trackFormEvent, trackCTAClick } from "@/lib/analytics";
import { getUTMParamsForSubmission } from "@/lib/utm";
import { getCountryCallingCode } from "libphonenumber-js";

const EXPERIENCE_OPTIONS = [
  { value: "beginner", label: "Principiante (menos de 6 meses activo)" },
  { value: "intermediate", label: "Intermedio (6 meses - 2 años)" },
  { value: "advanced", label: "Avanzado (más de 2 años)" },
];

const CHALLENGE_OPTIONS = [
  { value: "fundamental_analysis", label: "No sé cómo analizar proyectos fundamentalmente" },
  { value: "macro_context", label: "No entiendo cómo el contexto macro afecta los precios" },
  { value: "timing", label: "No sé cuándo entrar o salir de posiciones" },
  { value: "risk_management", label: "Me cuesta gestionar el riesgo y las emociones" },
  { value: "other", label: "Otro desafío" },
];

export function PdfLeadCaptureForm() {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    experienceLevel: "",
    mainChallenge: "",
  });

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    experienceLevel: false,
    mainChallenge: false,
  });

  const validation = useMemo(
    () => ({
      firstName: isValidName(formData.firstName),
      lastName: isValidName(formData.lastName),
      email: isValidEmail(formData.email),
      phone: isValidPhone(formData.phone, selectedCountry.code),
      experienceLevel: formData.experienceLevel !== "",
      mainChallenge: formData.mainChallenge !== "",
    }),
    [formData, selectedCountry.code]
  );

  const isFormValid =
    validation.firstName &&
    validation.lastName &&
    validation.email &&
    validation.phone &&
    validation.experienceLevel &&
    validation.mainChallenge &&
    acceptedTerms;

  const handleExpand = () => {
    setIsExpanded(true);
    trackCTAClick("pdf_sistema_medusa", "inline_form");
    trackEvent("pdf_cta_click", { cta_location: "analysis_framework_section" });
  };

  const handleFirstInteraction = () => {
    if (!hasTrackedStart) {
      trackFormEvent("pdf_sistema_medusa", "start");
      setHasTrackedStart(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError(null);
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field: keyof typeof validation): string | null => {
    if (!touched[field]) return null;

    switch (field) {
      case "firstName":
        if (!formData.firstName.trim()) return "El nombre es obligatorio";
        if (!validation.firstName) return "El nombre solo puede contener letras";
        break;
      case "lastName":
        if (!formData.lastName.trim()) return "El apellido es obligatorio";
        if (!validation.lastName) return "El apellido solo puede contener letras";
        break;
      case "email":
        if (!formData.email.trim()) return "El email es obligatorio";
        if (!validation.email) return "Introduce un email válido";
        break;
      case "phone":
        if (formData.phone.trim() && !validation.phone)
          return "Introduce un número de teléfono válido";
        break;
      case "experienceLevel":
        if (!validation.experienceLevel)
          return "Selecciona tu nivel de experiencia";
        break;
      case "mainChallenge":
        if (!validation.mainChallenge) return "Selecciona tu mayor desafío";
        break;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    trackFormEvent("pdf_sistema_medusa", "submit");

    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      experienceLevel: true,
      mainChallenge: true,
    });

    if (!isFormValid) return;

    setIsSubmitting(true);

    try {
      const formattedPhone = formatPhoneForSubmission(
        formData.phone,
        selectedCountry.code
      );
      const utmParams = getUTMParamsForSubmission();

      const response = await fetch("/api/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.firstName.trim().toUpperCase(),
          last_name: formData.lastName.trim().toUpperCase(),
          email: formData.email.trim().toLowerCase(),
          phone: formattedPhone,
          consent: acceptedTerms,
          lead_source: "pdf_sistema_medusa",
          experience_level: formData.experienceLevel,
          main_challenge: formData.mainChallenge,
          ...utmParams,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el formulario");
      }

      trackFormEvent("pdf_sistema_medusa", "success");
      router.push("/gracias-sistema-medusa");
    } catch {
      trackFormEvent("pdf_sistema_medusa", "error");
      setSubmitError("Ha ocurrido un error. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyles =
    "bg-[#1b1a64]/50 border-[#B9B8EB]/20 text-white placeholder:text-[#B9B8EB]/40 h-12 rounded-xl focus-visible:border-[#4355d9] focus-visible:ring-[#4355d9]/20";
  const errorInputStyles = "border-red-500/50 focus-visible:border-red-500";

  return (
    <>
      {/* Collapsed state — CTA button */}
      {!isExpanded && (
        <>
          <Button
            variant="primaryGlow"
            size="lg"
            onClick={handleExpand}
            className="px-8 py-6 text-base font-semibold rounded-xl gap-2 !bg-gradient-to-r !from-[#6B4CE6] !via-[#9074F6] !to-[#6B4CE6] shadow-[0_0_32px_rgba(144,116,246,0.45)] hover:shadow-[0_0_40px_rgba(144,116,246,0.6)]"
          >
            <Download className="w-5 h-5" />
            Descargar Sistema Medusa (PDF Gratis)
          </Button>
          <p className="text-sm mt-4 text-[#B9B8EB]/60">
            20 páginas &bull; Casos de estudio &bull; Checklists &bull; Templates
          </p>
        </>
      )}

      {/* Expanded state — inline form */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${
          isExpanded ? "max-h-[900px] opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-w-md mx-auto rounded-[20px] p-6 md:p-8 bg-gradient-to-br from-[#1b1a64]/70 to-[#151450]/90 border border-[#B9B8EB]/20">
          {/* Header */}
          <div className="mb-6">
            <h3 className="font-[family-name:var(--font-heading)] text-xl md:text-2xl font-bold text-white mb-2">
              Descarga el Sistema Medusa
            </h3>
            <p className="text-sm text-[#B9B8EB]/60">
              Completa el formulario y te lo enviaremos por email
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: First name + Last name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  name="firstName"
                  placeholder="Nombre"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  onFocus={handleFirstInteraction}
                  onBlur={() => handleBlur("firstName")}
                  aria-invalid={!!getFieldError("firstName")}
                  className={`${inputStyles} ${getFieldError("firstName") ? errorInputStyles : ""}`}
                />
                {getFieldError("firstName") && (
                  <p className="text-red-400 text-xs mt-1">
                    {getFieldError("firstName")}
                  </p>
                )}
              </div>
              <div>
                <Input
                  name="lastName"
                  placeholder="Apellido"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("lastName")}
                  aria-invalid={!!getFieldError("lastName")}
                  className={`${inputStyles} ${getFieldError("lastName") ? errorInputStyles : ""}`}
                />
                {getFieldError("lastName") && (
                  <p className="text-red-400 text-xs mt-1">
                    {getFieldError("lastName")}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Email */}
            <div>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleBlur("email")}
                aria-invalid={!!getFieldError("email")}
                className={`${inputStyles} ${getFieldError("email") ? errorInputStyles : ""}`}
              />
              {getFieldError("email") && (
                <p className="text-red-400 text-xs mt-1">
                  {getFieldError("email")}
                </p>
              )}
            </div>

            {/* Row 3: Phone with country selector */}
            <div className="relative">
              <div
                className={`flex items-center bg-[#1b1a64]/50 border rounded-xl h-12 ${
                  getFieldError("phone")
                    ? "border-red-500/50"
                    : "border-[#B9B8EB]/20"
                }`}
              >
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="flex items-center gap-2 px-4 h-full text-[#B9B8EB]/60 hover:text-[#B9B8EB] transition-colors"
                  >
                    <span className="text-base">{selectedCountry.flag}</span>
                    <span className="text-sm">
                      +{getCountryCallingCode(selectedCountry.code)}
                    </span>
                    <svg
                      className={`w-3 h-3 transition-transform ${
                        showCountryDropdown ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {showCountryDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-[#1b1a64] border border-[#B9B8EB]/20 rounded-xl shadow-xl z-20 py-1 min-w-[200px] max-h-[200px] overflow-y-auto">
                      {COUNTRIES.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(country);
                            setShowCountryDropdown(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-[#4355d9]/20 transition-colors ${
                            selectedCountry.code === country.code
                              ? "bg-[#4355d9]/10 text-white"
                              : "text-[#B9B8EB]/70"
                          }`}
                        >
                          <span>{country.flag}</span>
                          <span>{country.name}</span>
                          <span className="ml-auto text-[#B9B8EB]/40">
                            +{getCountryCallingCode(country.code)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Input
                  name="phone"
                  type="tel"
                  placeholder="Teléfono (opcional)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("phone")}
                  className="bg-transparent border-0 text-white placeholder:text-[#B9B8EB]/40 h-full p-0 focus-visible:ring-0 focus-visible:border-0"
                />
              </div>
              {getFieldError("phone") && (
                <p className="text-red-400 text-xs mt-1">
                  {getFieldError("phone")}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="pt-2 pb-1">
              <p className="text-sm font-medium text-white">
                Personaliza tu experiencia
              </p>
              <p className="text-xs text-[#B9B8EB]/40 mt-1">
                Así podemos enviarte contenido más relevante para tu nivel
              </p>
            </div>

            {/* Row 4: Experience level */}
            <div>
              <Select
                value={formData.experienceLevel}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, experienceLevel: value }));
                  setTouched((prev) => ({ ...prev, experienceLevel: true }));
                }}
              >
                <SelectTrigger
                  className={`w-full h-12 ${inputStyles} ${
                    touched.experienceLevel && !validation.experienceLevel
                      ? errorInputStyles
                      : ""
                  }`}
                >
                  <SelectValue placeholder="Selecciona tu nivel de experiencia" />
                </SelectTrigger>
                <SelectContent className="bg-[#1b1a64] border-[#B9B8EB]/20">
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-white hover:bg-[#4355d9]/20 focus:bg-[#4355d9]/20 focus:text-white"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError("experienceLevel") && (
                <p className="text-red-400 text-xs mt-1">
                  {getFieldError("experienceLevel")}
                </p>
              )}
            </div>

            {/* Row 5: Main challenge */}
            <div>
              <Select
                value={formData.mainChallenge}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, mainChallenge: value }));
                  setTouched((prev) => ({ ...prev, mainChallenge: true }));
                }}
              >
                <SelectTrigger
                  className={`w-full h-12 ${inputStyles} ${
                    touched.mainChallenge && !validation.mainChallenge
                      ? errorInputStyles
                      : ""
                  }`}
                >
                  <SelectValue placeholder="Selecciona tu mayor desafío" />
                </SelectTrigger>
                <SelectContent className="bg-[#1b1a64] border-[#B9B8EB]/20">
                  {CHALLENGE_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-white hover:bg-[#4355d9]/20 focus:bg-[#4355d9]/20 focus:text-white"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError("mainChallenge") && (
                <p className="text-red-400 text-xs mt-1">
                  {getFieldError("mainChallenge")}
                </p>
              )}
            </div>

            {/* Row 6: Consent */}
            <div className="flex items-start gap-3 pt-2">
              <Checkbox
                id="pdf-terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) =>
                  setAcceptedTerms(checked as boolean)
                }
                className="mt-0.5 border-[#B9B8EB]/30 data-[state=checked]:bg-[#4355d9] data-[state=checked]:border-[#4355d9]"
              />
              <label
                htmlFor="pdf-terms"
                className="text-sm text-[#B9B8EB]/60 cursor-pointer leading-relaxed"
              >
                Acepto recibir comunicaciones comerciales por correo electrónico
              </label>
            </div>

            {/* Error message */}
            {submitError && (
              <p className="text-red-400 text-sm text-center">{submitError}</p>
            )}

            {/* Row 7: Submit button */}
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full h-14 text-base font-semibold rounded-xl gap-2 !bg-gradient-to-r !from-[#6B4CE6] !via-[#9074F6] !to-[#6B4CE6] shadow-[0_0_32px_rgba(144,116,246,0.45)] hover:shadow-[0_0_40px_rgba(144,116,246,0.6)] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Enviando...
                </span>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Enviar y Recibir PDF
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
