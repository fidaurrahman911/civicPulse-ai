import React, { useState } from 'react';
import { useCivicStore } from '../../store/useCivicStore';
import {
  Users,
  ArrowRight,
  CheckCircle2,
  Lock,
  MapPin,
  AlertCircle,
  ShieldCheck,
  Globe,
  Building2,
  X,
  CreditCard,
  Phone,
  Mail,
  User as UserIcon,
  Info
} from 'lucide-react';

interface OnboardingAuthModalProps {
  navigate: (path: string) => void;
}

export const OnboardingAuthModal: React.FC<OnboardingAuthModalProps> = ({ navigate }) => {
  const {
    isOnboardingOpen,
    onboardingDefaultTab,
    closeOnboarding,
    continueAsGuest,
    loginAsCitizen,
    registerCitizen,
    openAdminAuthModal,
  } = useCivicStore();

  const [activeTab, setActiveTab] = useState<'signup' | 'login'>(onboardingDefaultTab || 'signup');

  // Sign up fields
  const [fullName, setFullName] = useState('');
  const [cnic, setCnic] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [tehsil, setTehsil] = useState('Tehsil Drosh');
  const [locationDetail, setLocationDetail] = useState('');

  // Sign up validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [signUpError, setSignUpError] = useState<string | null>(null);

  // Log in fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginFieldErrors, setLoginFieldErrors] = useState<Record<string, string>>({});

  if (!isOnboardingOpen) return null;

  // Auto-format CNIC with dashes (e.g. 15201-1234567-1)
  const handleCnicChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 13);
    let formatted = digits;
    if (digits.length > 5 && digits.length <= 12) {
      formatted = `${digits.slice(0, 5)}-${digits.slice(5)}`;
    } else if (digits.length > 12) {
      formatted = `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
    }
    setCnic(formatted);
    if (errors.cnic) {
      setErrors((prev) => ({ ...prev, cnic: '' }));
    }
  };

  const validateSignUpForm = (): boolean => {
    const errs: Record<string, string> = {};

    // 1. Full Name: Mandatory, min 3 chars
    if (!fullName.trim()) {
      errs.fullName = 'Full Name is required.';
    } else if (fullName.trim().length < 3) {
      errs.fullName = 'Full Name must be at least 3 characters.';
    } else if (/\d/.test(fullName)) {
      errs.fullName = 'Full Name must contain only alphabetical characters.';
    }

    // 2. CNIC: Mandatory, exactly 13 digits
    const cnicDigits = cnic.replace(/\D/g, '');
    if (!cnic.trim()) {
      errs.cnic = 'CNIC / National Identity Number is mandatory.';
    } else if (cnicDigits.length !== 13) {
      errs.cnic = 'Valid 13-digit CNIC is required (e.g. 15201-1234567-1).';
    }

    // 3. Email: Mandatory, standard format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = 'Email Address is mandatory.';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please enter a valid email address (e.g., name@domain.com).';
    }

    // 4. Password: Mandatory, min 6 characters
    if (!password) {
      errs.password = 'Password is mandatory.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    // 5. Mobile Number: Mandatory, Pakistan format
    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone.trim()) {
      errs.phone = 'Mobile Number is mandatory.';
    } else if (phoneDigits.length < 10 || phoneDigits.length > 12) {
      errs.phone = 'Valid Pakistan mobile number is required (e.g. 0345-9210084 or +92 345 9210084).';
    }

    // 6. District / Tehsil: Mandatory
    if (!tehsil.trim()) {
      errs.tehsil = 'Please select your District / Tehsil.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);

    // Strict client-side validation check
    const isValid = validateSignUpForm();
    if (!isValid) {
      setSignUpError('Please correct the highlighted fields below before submitting.');
      return;
    }

    const locationName = locationDetail.trim()
      ? `${locationDetail.trim()}, ${tehsil}, Lower Chitral`
      : `${tehsil}, Lower Chitral`;

    const res = registerCitizen({
      fullName: fullName.trim(),
      cnic: cnic.trim(),
      email: email.trim(),
      password: password.trim(),
      phone: phone.trim(),
      locationName,
      district: 'Lower Chitral',
      tehsil: tehsil.trim(),
    });

    if (res.success) {
      navigate('/dashboard');
    } else {
      setSignUpError(res.error || 'Failed to create account. Please try again.');
    }
  };

  const handleLogIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginFieldErrors({});

    const id = loginIdentifier.trim();
    const pw = loginPassword.trim();
    const errs: Record<string, string> = {};

    if (!id) {
      errs.identifier = 'Registered Email, CNIC, or Mobile Number is required.';
    }
    if (!pw) {
      errs.password = 'Password is required.';
    }

    if (Object.keys(errs).length > 0) {
      setLoginFieldErrors(errs);
      return;
    }

    // Strict authentic credential verification
    const res = loginAsCitizen(id, pw);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setLoginError(res.error || 'Invalid Credentials: Authentication failed. Please check your credentials.');
    }
  };

  const handleGuest = () => {
    continueAsGuest();
  };

  const handleOpenAdmin = () => {
    openAdminAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-xl border border-[#E3E8E6] shadow-2xl overflow-hidden my-auto">
        {/* Official Civic Header */}
        <div className="bg-[#0F1B2D] text-white p-6 relative border-b border-slate-800">
          <button
            onClick={handleGuest}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
            aria-label="Close and continue as guest"
            title="Continue as Guest"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#1F6B43] text-white text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Government of Khyber Pakhtunkhwa · District Lower Chitral</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              CivicPulse AI Portal Access
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md">
              Secure citizen authentication for verified volunteer action, municipal grievance submission, and district transparency in Tehsil Drosh.
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="p-6 sm:p-7 space-y-5 bg-white">
          <div className="grid grid-cols-2 p-1 bg-[#F6F8F7] rounded-lg border border-[#E3E8E6] text-xs">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setSignUpError(null);
                setErrors({});
              }}
              className={`py-2 px-3 rounded-[6px] font-semibold transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-white text-[#0F1B2D] shadow-2xs font-bold border border-[#E3E8E6]'
                  : 'text-[#4B5A6B] hover:text-[#0F1B2D]'
              }`}
            >
              Sign Up (New Citizen)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setLoginError(null);
                setLoginFieldErrors({});
              }}
              className={`py-2 px-3 rounded-[6px] font-semibold transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white text-[#0F1B2D] shadow-2xs font-bold border border-[#E3E8E6]'
                  : 'text-[#4B5A6B] hover:text-[#0F1B2D]'
              }`}
            >
              Log In (Existing Account)
            </button>
          </div>

          {/* TAB 1: STRICT SIGN UP */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5 text-xs" noValidate>
              {signUpError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{signUpError}</span>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#0F1B2D]">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                    }}
                    placeholder="e.g. Asad Ullah Khan"
                    className={`w-full pl-9 pr-3 py-2 rounded-[6px] border text-[#0F1B2D] text-xs transition-colors ${
                      errors.fullName
                        ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                        : 'border-[#E3E8E6] bg-[#F6F8F7] focus:bg-white focus:border-[#1F6B43]'
                    } focus:outline-none`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-[11px] text-red-600 font-medium">{errors.fullName}</p>
                )}
              </div>

              {/* CNIC Number */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#0F1B2D]">
                  CNIC / National Identity Number <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={cnic}
                    onChange={(e) => handleCnicChange(e.target.value)}
                    placeholder="15201-XXXXXXX-X (13 digits)"
                    maxLength={15}
                    className={`w-full pl-9 pr-3 py-2 rounded-[6px] border text-[#0F1B2D] text-xs font-mono transition-colors ${
                      errors.cnic
                        ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                        : 'border-[#E3E8E6] bg-[#F6F8F7] focus:bg-white focus:border-[#1F6B43]'
                    } focus:outline-none`}
                  />
                </div>
                {errors.cnic && (
                  <p className="text-[11px] text-red-600 font-medium">{errors.cnic}</p>
                )}
                <span className="text-[10px] text-slate-500 block">
                  NADRA identity standard for Khyber Pakhtunkhwa civic verification.
                </span>
              </div>

              {/* Email & Mobile Number (2 cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-[#0F1B2D]">
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      placeholder="citizen@example.pk"
                      className={`w-full pl-9 pr-3 py-2 rounded-[6px] border text-[#0F1B2D] text-xs transition-colors ${
                        errors.email
                          ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                          : 'border-[#E3E8E6] bg-[#F6F8F7] focus:bg-white focus:border-[#1F6B43]'
                      } focus:outline-none`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-red-600 font-medium">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-[#0F1B2D]">
                    Mobile Phone Number <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                      placeholder="0345-9210084"
                      className={`w-full pl-9 pr-3 py-2 rounded-[6px] border text-[#0F1B2D] text-xs transition-colors ${
                        errors.phone
                          ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                          : 'border-[#E3E8E6] bg-[#F6F8F7] focus:bg-white focus:border-[#1F6B43]'
                      } focus:outline-none`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] text-red-600 font-medium">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Password & Tehsil (2 cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-[#0F1B2D]">
                    Account Password <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                      }}
                      placeholder="Min. 6 characters"
                      className={`w-full pl-9 pr-3 py-2 rounded-[6px] border text-[#0F1B2D] text-xs transition-colors ${
                        errors.password
                          ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                          : 'border-[#E3E8E6] bg-[#F6F8F7] focus:bg-white focus:border-[#1F6B43]'
                      } focus:outline-none`}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-red-600 font-medium">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-[#0F1B2D]">
                    District & Tehsil <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <select
                      value={tehsil}
                      onChange={(e) => {
                        setTehsil(e.target.value);
                        if (errors.tehsil) setErrors((prev) => ({ ...prev, tehsil: '' }));
                      }}
                      className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-[#E3E8E6] bg-[#F6F8F7] focus:bg-white focus:border-[#1F6B43] focus:outline-none text-[#0F1B2D] text-xs"
                    >
                      <option value="Tehsil Drosh">Lower Chitral — Tehsil Drosh</option>
                      <option value="Tehsil Chitral">Lower Chitral — Tehsil Chitral</option>
                      <option value="Ayun Valley">Lower Chitral — Ayun Valley</option>
                      <option value="Shishi Koh Valley">Lower Chitral — Shishi Koh</option>
                      <option value="Tehsil Arandu">Lower Chitral — Tehsil Arandu</option>
                    </select>
                  </div>
                  {errors.tehsil && (
                    <p className="text-[11px] text-red-600 font-medium">{errors.tehsil}</p>
                  )}
                </div>
              </div>

              {/* Village / Local Area (Optional specification) */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#0F1B2D]">
                  Village / Ward / Street (Optional)
                </label>
                <input
                  type="text"
                  value={locationDetail}
                  onChange={(e) => setLocationDetail(e.target.value)}
                  placeholder="e.g. Drosh Main Bazaar, Ward No. 3"
                  className="w-full px-3 py-2 rounded-[6px] border border-[#E3E8E6] bg-[#F6F8F7] focus:bg-white focus:border-[#1F6B43] focus:outline-none text-[#0F1B2D] text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-[6px] text-xs font-bold bg-[#1F6B43] hover:bg-[#174F32] text-white shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Complete Registration & Open Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: STRICT LOG IN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogIn} className="space-y-4 text-xs" noValidate>
              {loginError && (
                <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-red-900 block">Invalid Credentials</span>
                    <p className="text-red-800 text-[11px] leading-relaxed">{loginError}</p>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#0F1B2D]">
                  Email, CNIC, or Mobile Number <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => {
                      setLoginIdentifier(e.target.value);
                      if (loginFieldErrors.identifier) {
                        setLoginFieldErrors((prev) => ({ ...prev, identifier: '' }));
                      }
                      setLoginError(null);
                    }}
                    placeholder="e.g. zulkaif@civicpulse.pk or 15201-9210084-1"
                    className={`w-full pl-9 pr-3 py-2 rounded-[6px] border text-[#0F1B2D] text-xs transition-colors ${
                      loginFieldErrors.identifier
                        ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                        : 'border-[#E3E8E6] bg-[#F6F8F7] focus:bg-white focus:border-[#1F6B43]'
                    } focus:outline-none`}
                  />
                </div>
                {loginFieldErrors.identifier && (
                  <p className="text-[11px] text-red-600 font-medium">{loginFieldErrors.identifier}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-[#0F1B2D]">
                  Password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (loginFieldErrors.password) {
                        setLoginFieldErrors((prev) => ({ ...prev, password: '' }));
                      }
                      setLoginError(null);
                    }}
                    placeholder="Enter your account password"
                    className={`w-full pl-9 pr-3 py-2 rounded-[6px] border text-[#0F1B2D] text-xs transition-colors ${
                      loginFieldErrors.password
                        ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                        : 'border-[#E3E8E6] bg-[#F6F8F7] focus:bg-white focus:border-[#1F6B43]'
                    } focus:outline-none`}
                  />
                </div>
                {loginFieldErrors.password && (
                  <p className="text-[11px] text-red-600 font-medium">{loginFieldErrors.password}</p>
                )}
              </div>

              {/* Demo Hint Helper */}
              <div className="p-2.5 rounded-lg bg-[#F6F8F7] border border-[#E3E8E6] text-[11px] text-[#4B5A6B] flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-[#1F6B43] shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <span className="font-semibold text-[#0F1B2D]">Registered Demo Citizen:</span>{' '}
                  <code className="text-[#1F6B43] font-mono text-[10px] bg-white px-1 py-0.5 rounded border border-[#E3E8E6]">zulkaif@civicpulse.pk</code>{' '}
                  / Password: <code className="text-[#1F6B43] font-mono text-[10px] bg-white px-1 py-0.5 rounded border border-[#E3E8E6]">Password123</code>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-[6px] text-xs font-bold bg-[#1F6B43] hover:bg-[#174F32] text-white shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Verify Credentials & Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* DIVIDER & GUEST EXPLORATION */}
          <div className="pt-4 border-t border-[#E3E8E6] space-y-2">
            <button
              type="button"
              onClick={handleGuest}
              className="w-full py-2.5 px-4 rounded-[6px] text-xs font-semibold bg-[#F6F8F7] hover:bg-[#E3E8E6] text-[#0F1B2D] border border-[#E3E8E6] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#1F6B43]" />
              <span>Continue as Guest Visitor</span>
            </button>
            <p className="text-[10px] text-[#718096] text-center leading-tight">
              Guest access enables read-only browsing of active campaigns, public works photo verification, and district grievance tracking.
            </p>
          </div>

          {/* SUBTLE ADMINISTRATIVE ACCESS LINK AT VERY BOTTOM */}
          <div className="pt-3 border-t border-[#E3E8E6] text-center">
            <p className="text-[11px] text-[#718096] flex items-center justify-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Authorized District Official?</span>{' '}
              <button
                type="button"
                onClick={handleOpenAdmin}
                className="text-[#1F6B43] hover:underline font-semibold cursor-pointer"
              >
                Administrative Portal Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
