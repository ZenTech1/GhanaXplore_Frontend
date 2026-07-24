'use client';

import { useState } from 'react';

interface AuthFormProps {
  defaultTab?: 'login' | 'signup';
}

export function AuthForm({ defaultTab = 'login' }: AuthFormProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupAccountType, setSignupAccountType] = useState('tourist');
  const [signupPassword, setSignupPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(
        activeTab === 'login'
          ? `Welcome back! Logged in as ${loginEmail}`
          : `Account created for ${signupName} (${signupAccountType})! Connected to GTA gateway.`
      );
    }, 1500);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Card Wrapper to provide horizontal spacing on mobile */}
      <div className="w-full max-w-md px-4 md:px-0">
        {/* Auth Card */}
        <div className="bg-surface-container-lowest rounded-2xl auth-card border border-outline-variant/30 overflow-hidden shadow-lg relative -mt-20 md:mt-0 z-30">
          {/* Auth Tabs */}
          <div className="flex border-b border-outline-variant/30">
          <button
            type="button"
            id="tab-login"
            className={`flex-1 py-4 md:py-5 font-label-lg text-label-lg transition-all text-center ${
              activeTab === 'login'
                ? 'text-primary border-b-2 border-primary font-bold auth-tab-active'
                : 'text-on-surface-variant hover:bg-surface-variant/20 font-normal'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            type="button"
            id="tab-signup"
            className={`flex-1 py-4 md:py-5 font-label-lg text-label-lg transition-all text-center ${
              activeTab === 'signup'
                ? 'text-primary border-b-2 border-primary font-bold auth-tab-active'
                : 'text-on-surface-variant hover:bg-surface-variant/20 font-normal'
            }`}
            onClick={() => setActiveTab('signup')}
          >
            Create Account
          </button>
        </div>

        {/* Forms Content */}
        <div className="p-6 md:p-8">
          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <form id="form-login" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="group">
                  <label className="block font-label-lg text-label-lg text-on-surface-variant mb-2" htmlFor="login-email">
                    Email Address
                  </label>
                  <div className="relative input-focus border border-outline-variant rounded-lg bg-surface-container-low flex items-center px-4 py-3 transition-all duration-200">
                    <span className="material-symbols-outlined text-on-surface-variant mr-3 text-xl">mail</span>
                    <input
                      id="login-email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-body-md font-body-md p-0 placeholder:text-outline text-on-surface"
                    />
                  </div>
                </div>

                <div className="group">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block font-label-lg text-label-lg text-on-surface-variant" htmlFor="login-password">
                      Password
                    </label>
                  </div>
                  <div className="relative input-focus border border-outline-variant rounded-lg bg-surface-container-low flex items-center px-4 py-3 transition-all duration-200">
                    <span className="material-symbols-outlined text-on-surface-variant mr-3 text-xl">lock</span>
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-body-md font-body-md p-0 placeholder:text-outline text-on-surface"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  <div className="flex justify-end mt-2">
                    <a href="#" className="font-label-sm text-label-sm text-primary font-bold hover:underline transition-all">
                      Forgot password?
                    </a>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-on-primary py-3.5 md:py-4 rounded-xl font-label-lg text-label-lg font-bold shadow-sm hover:bg-black group active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="material-symbols-outlined animate-spin text-white">progress_activity</span>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6 md:my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant/50" />
                </div>
                <div className="relative flex justify-center text-label-sm">
                  <span className="bg-surface-container-lowest px-4 text-on-surface-variant uppercase tracking-widest font-semibold">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => alert('Google authentication simulated')}
                  className="flex items-center justify-center gap-3 py-3 border border-outline-variant rounded-xl hover:bg-black group transition-colors active:scale-95"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="font-label-lg text-label-lg text-on-surface group-hover:text-white font-semibold">Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert('Facebook authentication simulated')}
                  className="flex items-center justify-center gap-3 py-3 border border-outline-variant rounded-xl hover:bg-black group transition-colors active:scale-95"
                >
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="font-label-lg text-label-lg text-on-surface group-hover:text-white font-semibold">Facebook</span>
                </button>
              </div>
            </form>
          )}

          {/* SIGNUP FORM */}
          {activeTab === 'signup' && (
            <form id="form-signup" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="group">
                  <label className="block font-label-lg text-label-lg text-on-surface-variant mb-2" htmlFor="signup-name">
                    Full Name
                  </label>
                  <div className="relative input-focus border border-outline-variant rounded-lg bg-surface-container-low flex items-center px-4 py-3 transition-all duration-200">
                    <span className="material-symbols-outlined text-on-surface-variant mr-3 text-xl">person</span>
                    <input
                      id="signup-name"
                      type="text"
                      required
                      placeholder="Kwame Mensah"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-body-md font-body-md p-0 placeholder:text-outline text-on-surface"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block font-label-lg text-label-lg text-on-surface-variant mb-2" htmlFor="signup-email">
                    Email Address
                  </label>
                  <div className="relative input-focus border border-outline-variant rounded-lg bg-surface-container-low flex items-center px-4 py-3 transition-all duration-200">
                    <span className="material-symbols-outlined text-on-surface-variant mr-3 text-xl">mail</span>
                    <input
                      id="signup-email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-body-md font-body-md p-0 placeholder:text-outline text-on-surface"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block font-label-lg text-label-lg text-on-surface-variant mb-2" htmlFor="signup-phone">
                    Phone Number
                  </label>
                  <div className="relative input-focus border border-outline-variant rounded-lg bg-surface-container-low flex items-center px-4 py-3 transition-all duration-200">
                    <span className="material-symbols-outlined text-on-surface-variant mr-3 text-xl">call</span>
                    <input
                      id="signup-phone"
                      type="tel"
                      placeholder="+233 XX XXX XXXX"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-body-md font-body-md p-0 placeholder:text-outline text-on-surface"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block font-label-lg text-label-lg text-on-surface-variant mb-2" htmlFor="account-type">
                    Account Type
                  </label>
                  <div className="relative input-focus border border-outline-variant rounded-lg bg-surface-container-low flex items-center px-4 py-3">
                    <span className="material-symbols-outlined text-on-surface-variant mr-3 text-xl">badge</span>
                    <select
                      id="account-type"
                      value={signupAccountType}
                      onChange={(e) => setSignupAccountType(e.target.value)}
                      className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-body-md font-body-md p-0 text-on-surface cursor-pointer"
                    >
                      <option value="tourist">Tourist</option>
                      <option value="operator">Operator</option>
                      <option value="guide">Guide</option>
                    </select>
                  </div>
                </div>

                <div className="group">
                  <label className="block font-label-lg text-label-lg text-on-surface-variant mb-2" htmlFor="signup-password">
                    Password
                  </label>
                  <div className="relative input-focus border border-outline-variant rounded-lg bg-surface-container-low flex items-center px-4 py-3 transition-all duration-200">
                    <span className="material-symbols-outlined text-on-surface-variant mr-3 text-xl">lock</span>
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Create a password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-body-md font-body-md p-0 placeholder:text-outline text-on-surface"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="cursor-pointer rounded text-primary focus:ring-primary accent-primary"
                />
                <label htmlFor="terms" className="text-label-sm text-on-surface-variant leading-tight cursor-pointer">
                  I agree to the{' '}
                  <a href="#" className="text-primary hover:underline font-semibold">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary hover:underline font-semibold">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-secondary-container hover:bg-black text-black hover:text-white py-3.5 md:py-4 rounded-xl font-label-lg text-label-lg font-bold shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>

    {/* Footer Partnership Info matching Auth Mobile mockup */}
    <div className="w-full bg-[#f0edec] md:bg-transparent mt-8 py-8 px-4 text-center space-y-4 border-t border-outline-variant/10 md:border-t-0">
      <div className="max-w-[320px] mx-auto space-y-4">
        <div className="flex items-center justify-center gap-3 opacity-90">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm p-1 border border-outline-variant/30 shrink-0">
            {/* Custom Ghana Tourism Authority / Passport badge SVG */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Green passport book */}
              <rect x="5" y="3" width="14" height="18" rx="2" fill="#0d631b" />
              {/* Gold border/details on passport */}
              <rect x="7" y="5" width="10" height="14" rx="1" stroke="#fdc003" strokeWidth="1" fill="none" opacity="0.3" />
              {/* Star in the center */}
              <path d="M12 8.5L13.1 11.2H16L13.7 12.8L14.6 15.5L12 13.8L9.4 15.5L10.3 12.8L8 11.2H10.9L12 8.5Z" fill="#fdc003" />
              {/* Gold double lines at the bottom */}
              <line x1="8" y1="16" x2="16" y2="16" stroke="#fdc003" strokeWidth="1" />
              <line x1="9" y1="17.5" x2="15" y2="17.5" stroke="#fdc003" strokeWidth="1" />
            </svg>
          </div>
          <div className="text-left">
            <p className="font-label-sm text-label-sm font-bold text-on-surface">Partnering with</p>
            <p className="font-label-sm text-[10px] leading-tight text-on-surface-variant">
              Ghana Tourism Authority Verified
            </p>
          </div>
        </div>

        <p className="font-label-sm text-label-sm text-on-surface-variant leading-relaxed">
          © 2024 GhanaXplore. Empowering your journey through West Africa’s vibrant heritage.
        </p>

        <div className="flex justify-center gap-4 font-label-sm text-label-sm text-primary font-semibold">
          <a href="#" className="hover:underline">
            Terms
          </a>
          <span className="text-outline-variant">•</span>
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <span className="text-outline-variant">•</span>
          <a href="#" className="hover:underline">
            Support
          </a>
        </div>
      </div>
    </div>
  </div>
  );
}
