'use client';

export function CommunityExperiences() {
  const experiences = [
    {
      id: 'pottery',
      title: 'Pottery Workshop in Pankrono',
      description:
        'Learn the ancient art of Ashanti pottery from master artisans in their family homes.',
      price: 'GH₵ 150 / person',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDsNVeCiSDlH2a1dU9LFnOakELtIjkX_7kO03Y8n1yqarwxnlxXeo8_JiO26G13-PPpV1R6_Z-mdDHvNsfcqDdWCRD-zkUzvm1Ui9-gcW_2USpJbNziLjKlbdEQV_7_fbe6E-nfg20Hz9ZQpVrOnSqjGmXJmF02vTNIoJ8lB2GFydWB_zl4hNsQG4ZK1_X5f-AULFzSZ_RMYXcNvXppPgqiQQ8opnlt9v4ebIRpDaZ9rEgtvgIXqNGJQqQCzcLI63_BJk1n3tstejn5',
    },
    {
      id: 'fishing',
      title: 'Fishing Morning in Jamestown',
      description:
        'Join local fishermen at dawn and enjoy a traditional breakfast prepared with the day’s catch.',
      price: 'GH₵ 85 / person',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAEA1UsgQSFoCa6pJAgMe1rTKEDAFxR3TbgaFPaThXpJCR5yMLOrKdSxJNb3mMHdRj5UtESH5Zx2A_tM-acZGYZEq1c4Vd8MqO3GZal37Bo-BksS_ReGHfFpu-IlaRlKmG9P8B1beN_ZGPKrXYyTUJG-kn0tkT-A9ouUUMLzlBFS3osirM6azxgdlqLMEPytSKrhGBdSzZV5xNBLG6N03aqTTlpsQnIdExA__DONnbnuX3uqZupt2nzDm1h8cQYVGKLPAPXlviJvjOv',
    },
    {
      id: 'jollof',
      title: 'Homestead Jollof Masterclass',
      description:
        'Master the secrets of the world’s best Jollof rice in a backyard kitchen in Osu.',
      price: 'GH₵ 200 / person',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDy7epCRO5lFynJ7efATS7Cx2wAJX76tXIugrKR-c-LAVQjdB27Xqt0GShqJN9dzfxQoqYY35t9n6j9QlARcxtGSRkXCrA_CoaSFmjlQkKrUSkHXYpC15axlyQaU8xeuonJPL-e3zPRe3dtOYTH5OIdFV9QbQLXD4xw0f3SZtpDzKALTuUQx65Q2P4K353smpEMhqDIIz8hBNsbDPzjauWCOxTuPNIKsQhTeyZ59_o3i1_CTwvJcyHOb7jB103aGkd-5yxiWpCDqUID',
    },
  ];

  return (
    <section className="hidden md:block py-section-gap px-container-padding-mobile md:px-container-padding-desktop bg-inverse-surface text-inverse-on-surface overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="font-display-lg text-4xl mb-4">Community-Led Experiences</h2>
            <p className="opacity-80">
              Support local communities while gaining insider access to traditions hidden from the standard tourist path.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              aria-label="Previous experience"
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              aria-label="Next experience"
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-white/5 rounded-2xl p-6 border border-white/10 group cursor-pointer hover:bg-white/10 transition-all"
            >
              <div className="h-48 rounded-xl mb-6 overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${exp.image}')` }}
                />
              </div>
              <h4 className="font-headline-md text-xl mb-2">{exp.title}</h4>
              <p className="opacity-70 text-sm mb-4">{exp.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-secondary-fixed-dim font-bold">{exp.price}</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

