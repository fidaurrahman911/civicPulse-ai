import React, { useState } from 'react';
import { useCivicStore } from '../store/useCivicStore';
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  User as UserIcon,
  CreditCard,
  Mail,
  Phone,
  Lock,
  MapPin,
  Building2,
  Info
} from 'lucide-react';

interface AuthPagesProps {
  mode: 'sign-in' | 'create-account' | 'forgot-password';
  navigate: (path: string) => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({ mode, navigate }) => {
  const { loginAsCitizen, registerCitizen, openAdminAuthModal } = useCivicStore();

  // Create Account State
  const [fullName, setFullName] = useState('');
  const [cnic, setCnic] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [tehsil, setTehsil] = useState('Tehsil Drosh');
  const [locationDetail, setLocationDetail] = useState('');
  const [createAccountErrors, setCreateAccountErrors] = useState<Record<string, string>>({});
  const [createAccountGeneralError, setCreateAccountGeneralError] = useState<string | null>(null);

  // Sign In State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginFieldErrors, setLoginFieldErrors] = useState<Record<string, string>>({});

  // Forgot password
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailError, setResetEmailError] = useState<string | null>(null);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

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
    if (createAccountErrors.cnic) {
      setCreateAccountErrors((prev) => ({ ...prev, cnic: '' }));
    }
  };

  const validateCreateAccount = (): boolean => {
    const errs: Record<string, string> = {};

    // 1. Full Name: Mandatory, min 3 chars, letters only
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

    // 3. Email: Mandatory, valid format
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
      errs.phone = 'Valid Pakistan mobile number is required (e.g. 0345-9210084).';
    }

    // 6. District / Tehsil: Mandatory
    if (!tehsil.trim()) {
      errs.tehsil = 'Please select your District / Tehsil.';
    }

    setCreateAccountErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateAccountGeneralError(null);

    const isValid = validateCreateAccount();
    if (!isValid) {
      setCreateAccountGeneralError('Please fill out all required fields with valid formats before submitting.');
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
      setCreateAccountGeneralError(res.error || 'Failed to create account. Please check your details.');
    }
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
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

    // Strict credentials check against registered profiles
    const res = loginAsCitizen(id, pw);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setLoginError(res.error || 'Invalid Credentials: No registered account matches these details.');
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetEmailError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!resetEmail.trim() || !emailRegex.test(resetEmail.trim())) {
      setResetEmailError('Please enter a valid registered email address.');
      return;
    }

    setSubmittedMessage('Password reset instructions have been dispatched to your verified email address.');
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12 space-y-6">
      {/* Official Government / Civic Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#1F6B43] text-white text-[11px] font-bold uppercase tracking-wider mx-auto">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Government of Khyber Pakhtunkhwa · District Lower Chitral</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F1B2D] tracking-tight">
          {mode === 'sign-in'
            ? 'Citizen Portal Sign In'
            : mode === 'create-account'
            ? 'Register New Citizen Profile'
            : 'Reset Account Password'}
        </h1>
        <p className="text-xs text-[#4B5A6B] max-w-sm mx-auto">
          Secure municipal portal for verified community work, grievance tracking, and local accountability in Tehsil Drosh.
        </p>
      </div>

      {submittedMessage ? (
        <div className="p-6 rounded-lg bg-[#E8F2EC] border border-[#1F6B43]/30 text-xs text-[#174F32] text-center space-y-3 shadow-xs">
          <CheckCircle2 className="w-8 h-8 text-[#1F6B43] mx-auto" />
          <p className="font-semibold text-sm">{submittedMessage}</p>
          <button
            onClick={() => {
              setSubmittedMessage(null);
              navigate('/sign-in');
            }}
            className="px-4 py-2 rounded-[6px] bg-[#1F6B43] text-white font-semibold text-xs cursor-pointer hover:bg-[#174F32]"
          >
            Return to Sign In
          </button>
        </div>
      ) : mode === 'create-account' ? (
        /* STRICT SIGN UP FORM */
        <form
          onSubmit={handleCreateAccountSubmit}
          className="bg-white p-6 sm:p-7 rounded-xl border border-[#E3E8E6] shadow-sm space-y-4 text-xs"
          noValidate
        >
          {createAccountGeneralError && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{createAccountGeneralError}</span>
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
                  if (createAccountErrors.fullName) {
                    setCreateAccountErrors((prev) => ({ ...prev, fullName: '' }));
                  }
                }}
                placeholder="e.g. Asad Ullah Khan"
                className={`w-full pl-9 pr-3 py-2 rounded-[6px] border text-[#0F1B2D] text-xs transition-colors ${
                  createAccountErrors.fullName
                    ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                    : 'border-[#E3E8E6] bg-[#F6F8F7] focus:bg-white focus:border-[#1F6B43]'
                } focus:outline-none`}
              />
            </div>
            {createAccountErrors.fullName && (
              <p className="text-[11px] text-red-600 font-medium">{createAccountErrors.fullName}</p>
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
                  createAccountErrors.cnic
                    ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                    : 'border-[#E3E8E6] bg-[#F6F8F7] focus:bg-white focus:border-[#1F6B43]'
                } focus:outline-none`}
              />
            </div>
            {createAccountErrors.cnic && (
              <p className="text-[11px] text-red-600 font-medium">{createAccountErrors.cnic}</p>
            )}
            <span className="text-[10px] text-slate-500 block">
              NADRA 13-digit identity standard for Khyber Pakhtunkhwa civic verification.
            </span>
          </div>

          {/* Email & Mobile Phone (2 cols) */}
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
                    if (createAccountErrors.email) {
                      setCreateAccountErrors((prev) => ({ ...prev, email: '' }));
                    }
                  }}
                  placeholder="citizen@example.pk"
                  className={`w-full pl-9 pr-3 py-2 rounded-[6px] border text-[#0F1B2D] text-xs transition-colors ${
                    createAccountErrors.email
                      ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                      : 'border-[#E3E8E6] bg-[#F6F8F7] focus:bg-white focus:border-[#1F6B43]'
                  } focus:outline-none`}
                />
              </div>
              {createAccountErrors.email && (
                <p className="text-[11px] text-red-600 font-medium">{createAccountErrors.email}</p>
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
                    if (createAccountErrors.phone) {
                      setCreateAccountErrors((prev) => ({ ...prev, phone: '' }));
                    }
                  }}
                  placeholder="0345-9210084"
                  className={`w-full pl-9 pr-3 py-2 rounded-[6px] border text-[#0F1B2D] text-xs transition-colors ${
                    createAccountErrors.phone
                      ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                      : 'border-[#E3E8E6] bg-[#F6F8F7] focus:bg-white focus:border-[#1F6B43]'
                  } focus:outline-none`}
                />
              </div>
              {createAccountErrors.phone && (
                <p className="text-[11px] text-red-600 font-medium">{createAccountErrors.phone}</p>
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
                    if (createAccountErrors.password) {
                      setCreateAccountErrors((prev) => ({ ...prev, password: '' }));
                    }
                  }}
                  placeholder="Min. 6 characters"
                  className={`w-full pl-9 pr-3 py-2 rounded-[6px] border text-[#0F1B2D] text-xs transition-colors ${
                    createAccountErrors.password
                      ? 'border-red-500 bg-red-50/30 focus:border-red-600'
                      : 'border-[#E3E8E6] bg-[#F6F8F7] focus:bg-white focus:border-[#1F6B43]'
                  } focus:outline-none`}
                />
              </div>
              {createAccountErrors.password && (
                <p className="text-[11px] text-red-600 font-medium">{createAccountErrors.password}</p>
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
                    if (createAccountErrors.tehsil) {
                      setCreateAccountErrors((prev) => ({ ...prev, tehsil: '' }));
                    }
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
              {createAccountErrors.tehsil && (
                <p className="text-[11px] text-red-600 font-medium">{createAccountErrors.tehsil}</p>
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

          <button
            type="submit"
            className="w-full py-2.5 rounded-[6px] text-xs font-bold bg-[#1F6B43] hover:bg-[#174F32] text-white shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <span>Complete Registration & Open Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="pt-3 border-t border-[#E3E8E6] text-center text-xs text-[#4B5A6B]">
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => navigate('/sign-in')}
                className="font-semibold text-[#1F6B43] hover:underline cursor-pointer"
              >
                Sign In to existing account
              </button>
            </p>
          </div>
        </form>
      ) : mode === 'sign-in' ? (
        /* STRICT LOG IN FORM */
        <form
          onSubmit={handleSignInSubmit}
          className="bg-white p-6 sm:p-7 rounded-xl border border-[#E3E8E6] shadow-sm space-y-4 text-xs"
          noValidate
        >
          {loginError && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-red-900 block">Invalid Credentials</span>
                <p className="text-red-800 text-[11px] leading-relaxed">{loginError}</p>
              </div>
            </div>
          )}

          {/* Identifier */}
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

          {/* Password */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-semibold text-[#0F1B2D]">
                Password <span className="text-red-600">*</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-[11px] text-[#1F5FA8] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
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

          {/* Demo Helper */}
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

          <div className="pt-3 border-t border-[#E3E8E6] text-center text-xs text-[#4B5A6B]">
            <p>
              New citizen in Lower Chitral?{' '}
              <button
                type="button"
                onClick={() => navigate('/create-account')}
                className="font-semibold text-[#1F6B43] hover:underline cursor-pointer"
              >
                Register an account
              </button>
            </p>
          </div>
        </form>
      ) : (
        /* FORGOT PASSWORD FORM */
        <form
          onSubmit={handleResetSubmit}
          className="bg-white p-6 sm:p-7 rounded-xl border border-[#E3E8E6] shadow-sm space-y-4 text-xs"
          noValidate
        >
          {resetEmailError && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{resetEmailError}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-[#0F1B2D]">
              Registered Email Address <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => {
                  setResetEmail(e.target.value);
                  setResetEmailError(null);
                }}
                placeholder="citizen@example.pk"
                className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-[#E3E8E6] bg-[#F6F8F7] focus:bg-white focus:border-[#1F6B43] text-[#0F1B2D] text-xs focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-[6px] text-xs font-bold bg-[#1F6B43] hover:bg-[#174F32] text-white shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Send Password Reset Instructions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="pt-3 border-t border-[#E3E8E6] text-center text-xs text-[#4B5A6B]">
            <button
              type="button"
              onClick={() => navigate('/sign-in')}
              className="font-semibold text-[#1F6B43] hover:underline cursor-pointer"
            >
              Return to Sign In
            </button>
          </div>
        </form>
      )}

      {/* SUBTLE ADMINISTRATIVE ACCESS LINK AT VERY BOTTOM */}
      <div className="pt-4 text-center">
        <p className="text-[11px] text-[#718096] flex items-center justify-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Authorized District Official?</span>{' '}
          <button
            type="button"
            onClick={() => openAdminAuthModal()}
            className="text-[#1F6B43] hover:underline font-semibold cursor-pointer"
          >
            Administrative Portal Login
          </button>
        </p>
      </div>
    </div>
  );
};
