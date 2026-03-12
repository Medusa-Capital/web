"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getCountryCallingCode } from "libphonenumber-js";
import { trackModalEvent, trackFormEvent, trackVideoEvent, trackLeadCapture } from "@/lib/analytics";
import { getUTMParamsForSubmission } from "@/lib/utm";
import {
  COUNTRIES,
  isValidName,
  isValidEmail,
  isValidPhone,
  formatPhoneForSubmission,
} from "@/lib/validation";

// Unlisted YouTube video URL (shown after successful submission)
const MASTERCLASS_VIDEO_ID = "9rNDE3FMWlo";

export function LeadCaptureModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
  });

  useEffect(() => {
    // Check if user has already seen/submitted the modal
    const hasSeenModal = localStorage.getItem("medusa-lead-modal-seen");
    if (hasSeenModal) return;

    // Show modal after 1 second
    const timer = setTimeout(() => {
      setIsOpen(true);
      trackModalEvent("lead_capture", "open");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Validation state
  const validation = useMemo(() => {
    return {
      firstName: isValidName(formData.firstName),
      lastName: isValidName(formData.lastName),
      email: isValidEmail(formData.email),
      phone: isValidPhone(formData.phone, selectedCountry.code),
    };
  }, [formData, selectedCountry.code]);

  const isFormValid =
    validation.firstName &&
    validation.lastName &&
    validation.email &&
    validation.phone &&
    acceptedTerms;

  const handleClose = () => {
    trackModalEvent("lead_capture", "close");
    setIsOpen(false);
    // Mark as seen so it doesn't show again this session
    localStorage.setItem("medusa-lead-modal-seen", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    trackFormEvent("lead_capture", "submit");

    // Mark all fields as touched
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.firstName.trim().toUpperCase(),
          last_name: formData.lastName.trim().toUpperCase(),
          email: formData.email.trim().toLowerCase(),
          phone: formattedPhone,
          consent: acceptedTerms,
          ...utmParams,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el formulario");
      }

      // Store submission
      localStorage.setItem("medusa-lead-modal-submitted", "true");
      localStorage.setItem("medusa-lead-modal-seen", "true");

      trackFormEvent("lead_capture", "success");
      trackLeadCapture();
      trackVideoEvent("masterclass", "play");
      setIsSubmitted(true);
    } catch {
      trackFormEvent("lead_capture", "error");
      setSubmitError(
        "Ha ocurrido un error. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsSubmitting(false);
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

  const getFieldError = (
    field: keyof typeof validation
  ): string | null => {
    if (!touched[field]) return null;

    switch (field) {
      case "firstName":
        if (!formData.firstName.trim()) return "El nombre es obligatorio";
        if (!validation.firstName)
          return "El nombre solo puede contener letras";
        break;
      case "lastName":
        if (!formData.lastName.trim()) return "El apellido es obligatorio";
        if (!validation.lastName)
          return "El apellido solo puede contener letras";
        break;
      case "email":
        if (!formData.email.trim()) return "El email es obligatorio";
        if (!validation.email) return "Introduce un email válido";
        break;
      case "phone":
        if (formData.phone.trim() && !validation.phone)
          return "Introduce un número de teléfono válido";
        break;
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className={`p-0 overflow-hidden bg-[#0a0a2e] border-[#B9B8EB]/20 ${
          isSubmitted ? "sm:max-w-5xl" : "sm:max-w-4xl"
        }`}
        showCloseButton={false}
      >
        {/* Custom close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#1b1a64]/80 border border-[#B9B8EB]/20 flex items-center justify-center text-[#B9B8EB]/60 hover:text-white hover:bg-[#1b1a64] transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className={`grid ${isSubmitted ? "" : "md:grid-cols-2"}`}>
          {/* Left side - Form */}
          <div className={`p-8 md:p-10 ${isSubmitted ? "hidden" : ""}`}>
            {!isSubmitted ? (
              <>
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-2xl md:text-3xl font-bold text-white font-heading leading-tight">
                    Aprende a Detectar Suelos y Techos en el Mercado
                  </DialogTitle>
                  <DialogDescription className="text-[#B9B8EB]/70 text-base mt-2">
                    Rellena el formulario y recibe acceso inmediato a nuestra
                    masterclass exclusiva
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        name="firstName"
                        placeholder="Nombre"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("firstName")}
                        aria-invalid={!!getFieldError("firstName")}
                        className={`bg-[#1b1a64]/50 border-[#B9B8EB]/20 text-white placeholder:text-[#B9B8EB]/40 h-12 rounded-xl focus-visible:border-[#4355d9] focus-visible:ring-[#4355d9]/20 ${
                          getFieldError("firstName")
                            ? "border-red-500/50 focus-visible:border-red-500"
                            : ""
                        }`}
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
                        className={`bg-[#1b1a64]/50 border-[#B9B8EB]/20 text-white placeholder:text-[#B9B8EB]/40 h-12 rounded-xl focus-visible:border-[#4355d9] focus-visible:ring-[#4355d9]/20 ${
                          getFieldError("lastName")
                            ? "border-red-500/50 focus-visible:border-red-500"
                            : ""
                        }`}
                      />
                      {getFieldError("lastName") && (
                        <p className="text-red-400 text-xs mt-1">
                          {getFieldError("lastName")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("email")}
                      aria-invalid={!!getFieldError("email")}
                      className={`bg-[#1b1a64]/50 border-[#B9B8EB]/20 text-white placeholder:text-[#B9B8EB]/40 h-12 rounded-xl focus-visible:border-[#4355d9] focus-visible:ring-[#4355d9]/20 ${
                        getFieldError("email")
                          ? "border-red-500/50 focus-visible:border-red-500"
                          : ""
                      }`}
                    />
                    {getFieldError("email") && (
                      <p className="text-red-400 text-xs mt-1">
                        {getFieldError("email")}
                      </p>
                    )}
                  </div>

                  {/* Phone with country selector */}
                  <div className="relative">
                    <div
                      className={`flex items-center bg-[#1b1a64]/50 border rounded-xl h-12 ${
                        getFieldError("phone")
                          ? "border-red-500/50"
                          : "border-[#B9B8EB]/20"
                      }`}
                    >
                      {/* Country selector */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setShowCountryDropdown(!showCountryDropdown)
                          }
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

                        {/* Dropdown */}
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

                  <div className="flex items-start gap-3 pt-2">
                    <Checkbox
                      id="terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) =>
                        setAcceptedTerms(checked as boolean)
                      }
                      className="mt-0.5 border-[#B9B8EB]/30 data-[state=checked]:bg-[#4355d9] data-[state=checked]:border-[#4355d9]"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-[#B9B8EB]/60 cursor-pointer leading-relaxed"
                    >
                      Acepto recibir comunicaciones comerciales por correo
                      electrónico
                    </label>
                  </div>

                  {submitError && (
                    <p className="text-red-400 text-sm text-center">
                      {submitError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="w-full h-14 text-base font-semibold rounded-xl bg-[#4355d9] hover:bg-[#5468eb] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
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
                      "Lo Quiero Ya"
                    )}
                  </Button>
                </form>
              </>
            ) : null}
          </div>

          {/* Right side - Preview card (only when form is shown) */}
          {!isSubmitted && (
            <div className="hidden md:flex items-center justify-center p-8 bg-gradient-to-br from-[#4355d9]/20 to-[#1b1a64]/40">
              <div className="relative w-full max-w-sm">
                {/* Exclusive badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1.5 text-sm font-medium rounded-full bg-[#1b1a64] text-white border border-[#B9B8EB]/20">
                    EXCLUSIVO
                  </span>
                </div>

                {/* Card */}
                <div className="glass-card gradient-border p-6 pt-8 text-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-white font-heading mb-6">
                    Toma de liquidez
                  </h3>

                  {/* Locked preview */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#B9B8EB]/10">
                    {/* Placeholder blurred content */}
                    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-white/5">
                      <Image
                        src="/img/logo.svg"
                        alt="Medusa Capital"
                        width={150}
                        height={50}
                        className="opacity-20"
                      />
                    </div>

                    {/* Lock icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#4355d9] flex items-center justify-center shadow-lg shadow-[#4355d9]/30">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success state - Full width video player */}
          {isSubmitted && (
            <div className="md:col-span-2 p-6 md:p-8">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/20 text-green-400 text-sm font-medium mb-3">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  ¡Acceso Concedido!
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white font-heading">
                  Toma de liquidez
                </h3>
              </div>

              {/* Large video player */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${MASTERCLASS_VIDEO_ID}?autoplay=1`}
                  title="Masterclass - Toma de liquidez"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
