import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { AuthForm } from '@/components/auth/AuthForm';

export default function LoginPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-background text-on-surface font-body overflow-x-hidden">
      {/* DESKTOP LEFT SIDE: Hero Image & Brand Narrative */}
      <section className="relative hidden md:flex md:w-1/2 lg:w-3/5 h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20000ms] hover:scale-105"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD_LLy-fCAhdSQjqIsvxB5PjPWHfc6Hrt5U7JBOogukiUpL1QReN8VTbXCprPiOtIGr2ZiQ57eeZU0H-2vRe6JC-4qnk06ng4TGvVAD9Uo2Vgn-Xnf29v0i0GUHwUugaxnBfJWh_TuPOgFweUIkfJMTpvyz_hKNFpx610QUZGNz-1LldG1PVpMRJdsVtLlb3kI-aMOfds5kmUeaufB7GsoCFv991jzerfBrsxE2pIrfNIXfieOSt0KKXSmzx0NfLsd18qkOqjvyCYhF')`,
          }}
        />
        {/* Dark overlay gradient */}
        <div className="relative z-10 flex flex-col justify-between h-screen p-container-padding-desktop bg-gradient-to-t from-black/75 via-black/30 to-transparent w-138">
          <div>
            <Link href={`/${params.locale}`} className="inline-block">
              <h1 className="font-headline-lg text-headline-lg text-white font-bold -mt-12">
                GhanaXplore
              </h1>
            </Link>
          </div>

          <div className="max-w-xl my-auto">
            <h2 className="font-display-lg text-5xl text-white mb-6 leading-tight drop-shadow-md">
              Discover the soul of West Africa.
            </h2>
            <p className="font-body-lg text-body-lg text-white/90 leading-relaxed drop-shadow-sm">
              Join our community of travelers and locals. Experience Ghana’s vibrant heritage, lush landscapes, and burgeoning digital future through curated tours and authentic stays.
            </p>
          </div>

          <div className="flex items-center gap-4 text-white/80 font-label-lg pt-4 -mb-8">
            <span className="material-symbols-outlined text-white">verified</span>
            <span>In partnership with Ghana Tourism Authority</span>
          </div>
        </div>
      </section>

      {/* MOBILE HEADER SECTION */}
      <div className="md:hidden relative h-[280px] w-full overflow-hidden flex items-center justify-center shrink-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCYoNgAVRg_6_ubJoMb9pypdo-Hd054fyvuoHO2MfItP_ThcaSHzbrzJeCg8jHaO9ZDJpS117ie4FgOa6BtbdiD4eDMAVOCAa7ubpMlpJ1YvGLXJOkgHhKCjysypfUpPrb_j3RJCjhUr-I5orsEfBpFixi_N2BDGCtuRGfBv-rNRkwwsbmo7YCxk5mW-AVV44IdtG7J2KjJiJ3TSf06gkX6llZNwbPwtfMllphT6ORXJ7V9MLTABmIjFjmEVPfnIMekHJpUNbBZUS61')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        </div>
        <div className="relative z-10 text-center">
          <Link href={`/${params.locale}`}>
            <h1 className="font-headline-md text-headline-md font-bold text-white tracking-tight drop-shadow-lg">
              GhanaXplore
            </h1>
          </Link>
          <p className="font-label-sm text-label-sm text-white/90 tracking-widest uppercase mt-1">
            Discover Your Roots
          </p>
        </div>
      </div>

      {/* RIGHT SIDE / MOBILE MAIN CONTENT: Auth Form */}
      <section className="flex-1 flex flex-col items-center justify-start p-0 md:p-container-padding-desktop bg-surface md:h-screen md:overflow-y-scroll relative z-20">
        <AuthForm defaultTab="login" />
      </section>
    </main>
  );
}
