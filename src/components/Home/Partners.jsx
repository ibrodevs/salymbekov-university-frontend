import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import lincolnLogo from '../../assets/partners/intl/lincoln.webp';
import intiLogo from '../../assets/partners/intl/inti.png';
import spbpuLogo from '../../assets/partners/intl/spbpu.jpg';
import paiChaiLogo from '../../assets/partners/intl/pai-chai.png';
import chungAngLogo from '../../assets/partners/intl/chung-ang.png';
import visionJeonjuLogo from '../../assets/partners/intl/vision-jeonju.png';
import kyungdongLogo from '../../assets/partners/intl/kyungdong.png';
import kicbLogo from '../../assets/partners/intl/kicb.png';
import baiTushumLogo from '../../assets/partners/intl/bai-tushum.jpeg';
import rkdfLogo from '../../assets/partners/intl/rkdf.png';

// Partner logos bundled with the app so the carousel always renders,
// regardless of the backend media storage state.
const partners = [
  { id: 'lincoln', name: 'Lincoln University College', logo: lincolnLogo, website: '' },
  { id: 'inti', name: 'INTI International University', logo: intiLogo, website: '' },
  { id: 'spbpu', name: 'Санкт-Петербургский политехнический университет Петра Великого', logo: spbpuLogo, website: '' },
  { id: 'pai-chai', name: 'Pai Chai University', logo: paiChaiLogo, website: '' },
  { id: 'chung-ang', name: 'Chung-Ang University', logo: chungAngLogo, website: '' },
  { id: 'vision-jeonju', name: 'Vision College of Jeonju', logo: visionJeonjuLogo, website: '' },
  { id: 'kyungdong', name: 'Kyungdong University', logo: kyungdongLogo, website: '' },
  { id: 'kicb', name: 'KICB', logo: kicbLogo, website: '' },
  { id: 'bai-tushum', name: 'Банк Бай-Тушум', logo: baiTushumLogo, website: '' },
  { id: 'rkdf', name: 'Российско-Кыргызский фонд развития', logo: rkdfLogo, website: '' },
];

const Partners = () => {
  const { t } = useTranslation();
  const scrollerRef = useRef(null);

  // Duplicating array for infinite scrolling effect
  const duplicatedPartners = [...partners, ...partners];

  // Smooth scroll effect using requestAnimationFrame
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let animationId;
    let position = 0;
    const speed = 0.5; // px per frame

    const animate = () => {
      position -= speed;

      // Reset position when scrolled halfway
      if (Math.abs(position) > scroller.scrollWidth / 2) {
        position = 0;
      }

      scroller.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section className="py-16 bg-slate-50 border-t border-b border-slate-100 overflow-hidden relative">
      <div className="container mx-auto relative z-10 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12">
          {t('partners.title')}
        </h2>

        <div className="relative py-4">
          <div
            ref={scrollerRef}
            className="flex whitespace-nowrap items-center"
          >
            {duplicatedPartners.map((partner, index) => (
              <a
                key={`${partner.id}-${index}`}
                href={partner.website || '#'}
                target={partner.website ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center mx-6 p-5 rounded-xl bg-white border border-slate-200/60 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105"
                style={{ minWidth: '180px', height: '110px' }}
                title={partner.name}
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-20 max-w-full object-contain"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
