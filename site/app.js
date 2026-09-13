const {
  useState,
  useEffect
} = React;
const LangContext = React.createContext('it');
function useLang() {
  return React.useContext(LangContext);
}
const RevealContext = React.createContext(false);
function RevealSection({
  storageKey,
  threshold = 0.35,
  children,
  style
}) {
  const ref = React.useRef(null);
  const [played, setPlayed] = useState(() => {
    try {
      return sessionStorage.getItem(storageKey) === '1';
    } catch (e) {
      return false;
    }
  });
  useEffect(() => {
    if (played) return;
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setPlayed(true);
      try {
        sessionStorage.setItem(storageKey, '1');
      } catch (e) {}
      return;
    }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setPlayed(true);
          try {
            sessionStorage.setItem(storageKey, '1');
          } catch (e) {}
          obs.disconnect();
        }
      });
    }, {
      threshold
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [played, storageKey, threshold]);
  return React.createElement("div", {
    ref: ref,
    style: style
  }, React.createElement(RevealContext.Provider, {
    value: played
  }, children));
}
function SlideInLine({
  index = 0,
  children,
  style
}) {
  const played = React.useContext(RevealContext);
  return React.createElement("div", {
    style: {
      opacity: played ? 1 : 0,
      transform: played ? 'translateX(0)' : 'translateX(-40px)',
      transition: `opacity 1.2s ease ${index * 0.24}s, transform 1.2s cubic-bezier(0.16,1,0.3,1) ${index * 0.24}s`,
      ...style
    }
  }, children);
}
function ScrollReveal({
  children,
  style,
  threshold = 0.15
}) {
  const ref = React.useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      });
    }, {
      threshold
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return React.createElement("div", {
    ref: ref,
    style: {
      ...style,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(22px)',
      transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)'
    }
  }, children);
}
function MountReveal({
  index = 0,
  children,
  style
}) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setEntered(true);
      return;
    }
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return React.createElement("div", {
    style: {
      ...style,
      opacity: entered ? 1 : 0,
      transform: entered ? 'translateY(0)' : 'translateY(18px)',
      transition: `opacity 1.2s ease ${index * 0.24}s, transform 1.2s cubic-bezier(0.16,1,0.3,1) ${index * 0.24}s`
    }
  }, children);
}
function MenuSectionReveal({
  sectionId,
  sectionRefs,
  style,
  children
}) {
  const ref = React.useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      });
    }, {
      threshold: 0.12
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return React.createElement("div", {
    id: `section-${sectionId}`,
    "data-section-id": sectionId,
    ref: el => {
      ref.current = el;
      if (sectionRefs) sectionRefs.current[sectionId] = el;
    },
    style: {
      ...style,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)'
    }
  }, children);
}
function AssembleImage({
  src,
  alt
}) {
  const played = React.useContext(RevealContext);
  return React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      overflow: 'hidden'
    }
  }, React.createElement("img", {
    src: src,
    alt: alt,
    loading: "lazy",
    decoding: "async",
    style: {
      width: '100%',
      height: 'auto',
      objectFit: 'contain',
      objectPosition: 'center',
      display: 'block',
      mixBlendMode: 'multiply',
      opacity: played ? 1 : 0,
      transform: played ? 'translateX(0)' : 'translateX(120%)',
      transition: 'opacity 1.8s ease, transform 1.8s cubic-bezier(0.16,1,0.3,1)'
    }
  }));
}
function useViewport() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener('resize', handler);
    window.addEventListener('orientationchange', handler);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('orientationchange', handler);
    };
  }, []);
  return {
    width: w,
    isPhone: w <= 480,
    isMobile: w <= 768,
    isTablet: w > 768 && w <= 1024,
    isDesktop: w > 1024
  };
}
const CONTACT_EMAIL = 'gastronomiapiva@libero.it';
const CONTACT_FORM_KEY = '6fb714fc-2ef5-4dba-ae06-803bb9d08586';
const CONTACT_FORM_KEY_2 = '853c4bf3-6738-4778-804d-6cafb02db966';
const DIALECT_SAYINGS = ["El pan del dì de prima l'è un baso de bon Dio.", "A catar bota pì che el pan!", "Tuti i poenta e bocal.", "Ciapar el musso par la coa.", "Mangia che te fa belo, bevi che te fa tondo.", "El vin el fa bon sangue, ma l'aqua la fa la mufa.", "Vestite ben che i te speta, va in camisa che i te conose.", "El tempo l'è come le done: el fa quel che vol lù.", "El lupo el perde el peo, ma no el vizio.", "A verzer la boca se fa pì presto che a serarla.", "Ciapa su e porta casa.", "Esser come i osei de Padoa: tanta vose e gnente sostanza.", "Fé el passo secondo la gamba.", "Pian pianin se va lontan.", "Tuti i conti i torna, ma i zeri i pesa.", "No tor via el tempo al bon tempo.", "Se no l'è lu, l'è so fradèlo.", "Va a ciapar le senzale.", "L'è un omo da strapazo.", "O vecia o nova, la poenta la m'inova."];
function DialectMarquee() {
  const {
    lang
  } = useLang();
  const vp = useViewport();
  if (lang !== 'vec') return null;
  const items = DIALECT_SAYINGS.concat(DIALECT_SAYINGS);
  return React.createElement("div", {
    className: "dialect-marquee-strip",
    role: "marquee",
    "aria-label": "Modi de dire polesani",
    style: {
      background: '#1A1108',
      borderBottom: '2px solid #D4A640',
      overflow: 'hidden',
      position: 'relative'
    }
  }, React.createElement("div", {
    className: "dialect-marquee-track",
    style: {
      padding: vp.isMobile ? '8px 0' : '9px 0'
    }
  }, items.map((s, i) => React.createElement("span", {
    key: i,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      flexShrink: 0
    }
  }, React.createElement("span", {
    style: {
      color: '#D4A640',
      fontSize: vp.isMobile ? 12 : 13,
      margin: vp.isMobile ? '0 14px' : '0 20px'
    },
    "aria-hidden": "true"
  }, "◆"), React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: vp.isMobile ? 13 : 15,
      color: '#F5F0E6',
      letterSpacing: '0.01em'
    }
  }, s)))));
}
function LangBar({
  onNavigate
}) {
  const vp = useViewport();
  const {
    lang,
    setLang
  } = useLang();
  const [showCallout, setShowCallout] = useState(() => {
    try {
      return lang === 'it' && !sessionStorage.getItem('piva_dialect_callout_seen');
    } catch (e) {
      return false;
    }
  });
  const dismissCallout = () => {
    setShowCallout(false);
    try {
      sessionStorage.setItem('piva_dialect_callout_seen', '1');
    } catch (e) {}
  };
  return React.createElement("div", {
    className: "notranslate",
    translate: "no",
    style: {
      background: '#FDFAF4',
      borderBottom: '1px solid rgba(61,43,26,0.10)',
      padding: vp.isMobile ? '6px 14px' : '7px 40px',
      display: 'flex',
      justifyContent: 'center',
      position: 'relative'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      maxWidth: 1200,
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      gap: vp.isMobile ? 8 : 10,
      position: 'relative'
    }
  }, [{
    code: 'it',
    flag: '🇮🇹',
    label: 'Italiano',
    short: 'IT'
  }, {
    code: 'en',
    flag: '🇬🇧',
    label: 'English',
    short: 'EN'
  }, {
    code: 'vec',
    label: 'Rovigòto (dialèto)',
    short: 'Rovigoto',
    svg: true
  }].map(({
    code,
    flag,
    label,
    short,
    svg
  }) => React.createElement("button", {
    key: code,
    onClick: () => {
      if (code === 'vec') {
        dismissCallout();
        if (lang === 'vec') {
          window.location.href = 'rovigoto/index.html';
          return;
        }
      }
      setLang(code);
    },
    "aria-label": label,
    title: code === 'vec' && lang === 'vec' ? 'Vai al dizionario Rovigòto' : label,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      flexShrink: 0,
      position: 'relative'
    }
  }, code === 'vec' && showCallout && React.createElement("div", {
    role: "tooltip",
    style: {
      position: 'absolute',
      top: '50%',
      left: '100%',
      marginLeft: 10,
      transform: 'translateY(-50%)',
      width: 168,
      background: '#C8251D',
      color: '#FDFAF4',
      borderRadius: 10,
      padding: '10px 12px',
      fontFamily: 'var(--font-body)',
      fontSize: 11.5,
      lineHeight: 1.5,
      fontWeight: 400,
      boxShadow: '0 8px 24px rgba(200,37,29,0.32)',
      zIndex: 50,
      whiteSpace: 'normal',
      textAlign: 'left',
      animation: 'dialect-invite 2.2s ease-in-out infinite'
    }
  }, "Parli Rovigòto? Prova il sito nel nostro dialetto.", React.createElement("div", {
    style: {
      position: 'absolute',
      top: '50%',
      right: '100%',
      transform: 'translateY(-50%)',
      width: 0,
      height: 0,
      borderTop: '6px solid transparent',
      borderBottom: '6px solid transparent',
      borderRight: '6px solid #C8251D'
    }
  })), code === 'vec' && !showCallout && lang === 'vec' && React.createElement("div", {
    role: "tooltip",
    style: {
      position: 'absolute',
      top: '50%',
      left: '100%',
      marginLeft: 10,
      transform: 'translateY(-50%)',
      width: 176,
      background: '#D4A640',
      color: '#1A1108',
      borderRadius: 10,
      padding: '10px 12px',
      fontFamily: 'var(--font-body)',
      fontSize: 11.5,
      lineHeight: 1.5,
      fontWeight: 600,
      boxShadow: '0 8px 24px rgba(212,166,64,0.38)',
      zIndex: 50,
      whiteSpace: 'normal',
      textAlign: 'left',
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      animation: 'dialect-invite 2.2s ease-in-out infinite'
    }
  }, React.createElement("span", null, "Struca ancora: va al dizionario"), React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#1A1108",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flexShrink: 0
    }
  }, React.createElement("path", {
    d: "M5 12h13M13 6l6 6-6 6"
  })), React.createElement("div", {
    style: {
      position: 'absolute',
      top: '50%',
      right: '100%',
      transform: 'translateY(-50%)',
      width: 0,
      height: 0,
      borderTop: '6px solid transparent',
      borderBottom: '6px solid transparent',
      borderRight: '6px solid #D4A640'
    }
  })), React.createElement("span", {
    style: {
      width: vp.isMobile ? 28 : 30,
      height: vp.isMobile ? 28 : 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      fontSize: vp.isMobile ? 14 : 15,
      background: lang === code ? '#F5F0E6' : 'transparent',
      border: lang === code ? '2px solid #D4A640' : '1px solid rgba(61,43,26,0.20)',
      borderRadius: '50%',
      transition: 'all 0.2s ease',
      lineHeight: 1
    }
  }, svg ? React.createElement("img", {
    src: "images/brand/flag_rovigo.png",
    alt: "",
    "aria-hidden": "true",
    style: {
      width: '86%',
      height: '86%',
      objectFit: 'contain',
      display: 'block'
    }
  }) : flag), React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 8 : 9,
      fontWeight: 700,
      letterSpacing: '0.06em',
      color: lang === code ? '#C8251D' : '#8A7A63'
    }
  }, short)))), React.createElement("button", {
    onClick: () => onNavigate('ricette'),
    style: {
      background: '#C8251D',
      color: '#fff',
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 12 : 13,
      fontWeight: 600,
      padding: vp.isMobile ? '7px 14px' : '9px 20px',
      borderRadius: 999,
      border: 'none',
      cursor: 'pointer',
      letterSpacing: '0.04em',
      boxShadow: '0 2px 8px rgba(200,37,29,0.25)',
      transition: 'all 0.25s ease',
      flexShrink: 0,
      whiteSpace: 'nowrap'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = '#9E1C16';
      e.currentTarget.style.transform = 'translateY(-1px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = '#C8251D';
      e.currentTarget.style.transform = 'translateY(0)';
    }
  }, lang === 'vec' ? 'Ricéte' : lang === 'en' ? 'Recipes' : 'Ricette')));
}
function Header({
  activePage,
  onNavigate
}) {
  const [scrolled, setScrolled] = useState(false);
  const vp = useViewport();
  const {
    lang,
    setLang
  } = React.useContext(LangContext);
  useEffect(() => {
    const el = document.getElementById('root');
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);
  const links = lang === 'vec' ? [{
    id: 'home',
    label: 'Casa'
  }, {
    id: 'menu',
    label: vp.isPhone ? 'Menù' : 'El Menù'
  }, {
    id: 'about',
    label: 'Chi Sémo'
  }, {
    id: 'contact',
    label: 'Contàti'
  }] : lang === 'en' ? [{
    id: 'home',
    label: 'Home'
  }, {
    id: 'menu',
    label: 'Menu'
  }, {
    id: 'about',
    label: 'About Us'
  }, {
    id: 'contact',
    label: 'Contact'
  }] : [{
    id: 'home',
    label: 'Home'
  }, {
    id: 'menu',
    label: vp.isPhone ? 'Menù' : 'Il Menù'
  }, {
    id: 'about',
    label: 'Chi Siamo'
  }, {
    id: 'contact',
    label: 'Contatti'
  }];
  return React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: scrolled ? 'rgba(253,250,244,0.97)' : 'rgba(253,250,244,0.97)',
      backdropFilter: 'blur(12px)',
      boxShadow: scrolled ? '0 2px 16px rgba(26,17,8,0.10)' : '0 1px 0 rgba(26,17,8,0.06)',
      transition: 'all 0.3s ease',
      padding: vp.isMobile ? '0 14px' : '0 40px'
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      height: vp.isMobile ? 60 : 72,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, React.createElement("div", {
    onClick: () => onNavigate('home'),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: vp.isMobile ? 8 : 12,
      cursor: 'pointer',
      minWidth: 0
    }
  }, React.createElement("img", {
    src: window.IMGS.logoSvg,
    alt: "F.lli Piva",
    loading: "eager",
    decoding: "async",
    style: {
      width: vp.isMobile ? 56 : 88,
      height: vp.isMobile ? 31 : 49,
      borderRadius: 0,
      objectFit: 'contain',
      flexShrink: 0
    }
  }), React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: vp.isMobile ? 14 : 17,
      color: '#1A1108',
      lineHeight: 1.1,
      whiteSpace: 'nowrap'
    }
  }, "F.lli Piva"), !vp.isPhone && !vp.isTablet && React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: vp.isMobile ? 9 : 10,
      color: '#6B4C33',
      whiteSpace: 'nowrap'
    }
  }, "dal 1960 · in cucina per voi"))), React.createElement("nav", {
    style: {
      display: 'flex',
      gap: vp.isMobile ? 12 : vp.isTablet ? 16 : 28,
      alignItems: 'center',
      flexShrink: 0
    }
  }, links.map(l => React.createElement("button", {
    key: l.id,
    onClick: () => onNavigate(l.id),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      fontSize: vp.isPhone ? 11 : vp.isMobile ? 12 : 14,
      fontWeight: activePage === l.id ? 600 : 400,
      color: activePage === l.id ? '#C8251D' : '#3D2B1A',
      paddingBottom: 2,
      padding: vp.isMobile ? '4px 2px' : undefined,
      borderBottom: activePage === l.id ? '2px solid #C8251D' : '2px solid transparent',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap'
    }
  }, l.label)))));
}
const DAY_NAMES_IT = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const HOURS_ESTATE = [{
  day: 'Lunedì',
  times: ['8:00 – 13:00', '17:00 – 20:00']
}, {
  day: 'Martedì',
  times: ['8:00 – 13:00', '17:00 – 20:00']
}, {
  day: 'Mercoledì',
  times: ['8:00 – 13:00'],
  note: 'Pomeriggio chiuso'
}, {
  day: 'Giovedì',
  times: ['8:00 – 13:00', '17:00 – 20:00']
}, {
  day: 'Venerdì',
  times: ['8:00 – 13:00', '17:00 – 20:00']
}, {
  day: 'Sabato',
  times: ['8:00 – 13:00', '17:00 – 20:00']
}, {
  day: 'Domenica',
  times: ['Chiuso'],
  closed: true
}];
const HOURS_INVERNO = [{
  day: 'Lunedì',
  times: ['8:00 – 13:00', '16:30 – 19:30']
}, {
  day: 'Martedì',
  times: ['8:00 – 13:00', '16:30 – 19:30']
}, {
  day: 'Mercoledì',
  times: ['8:00 – 13:00'],
  note: 'Pomeriggio chiuso'
}, {
  day: 'Giovedì',
  times: ['8:00 – 13:00', '16:30 – 19:30']
}, {
  day: 'Venerdì',
  times: ['8:00 – 13:00', '16:30 – 19:30']
}, {
  day: 'Sabato',
  times: ['8:00 – 13:00', '16:30 – 19:30']
}, {
  day: 'Domenica',
  times: ['Chiuso'],
  closed: true
}];
const HOURS_DECEMBER = [{
  day: 'Lunedì',
  times: ['8:00 – 13:00', '17:00 – 20:00']
}, {
  day: 'Martedì',
  times: ['8:00 – 13:00', '17:00 – 20:00']
}, {
  day: 'Mercoledì',
  times: ['8:00 – 13:00'],
  note: 'Pomeriggio chiuso'
}, {
  day: 'Giovedì',
  times: ['8:00 – 13:00', '17:00 – 20:00']
}, {
  day: 'Venerdì',
  times: ['8:00 – 13:00', '17:00 – 20:00']
}, {
  day: 'Sabato',
  times: ['8:00 – 13:00', '17:00 – 20:00']
}, {
  day: 'Domenica',
  times: ['Chiuso'],
  closed: true
}];
const HOLIDAYS_BASE = [{
  name: 'Capodanno',
  date: '1 gennaio'
}, {
  name: 'Epifania',
  date: '6 gennaio'
}, {
  name: 'Pasqua e Pasquetta',
  variableEaster: true
}, {
  name: 'Festa della Liberazione',
  date: '25 aprile'
}, {
  name: 'Festa del Lavoro',
  date: '1 maggio'
}, {
  name: 'Festa della Repubblica',
  date: '2 giugno'
}, {
  name: 'Ferragosto',
  date: '15 agosto'
}, {
  name: 'Ognissanti',
  date: '1 novembre'
}, {
  name: 'Immacolata Concezione',
  date: '8 dicembre'
}, {
  name: 'Natale',
  date: '25 dicembre'
}, {
  name: 'Santo Stefano',
  date: '26 dicembre'
}];
const HOLIDAY_NAME_EN = {
  'Capodanno': "New Year's Day",
  'Epifania': 'Epiphany',
  'Pasqua e Pasquetta': 'Easter & Easter Monday',
  'Festa della Liberazione': 'Liberation Day',
  'Festa del Lavoro': 'Labour Day',
  'Festa della Repubblica': 'Republic Day',
  'Ferragosto': 'Ferragosto (Assumption Day)',
  'Ognissanti': "All Saints' Day",
  'Immacolata Concezione': 'Immaculate Conception',
  'Natale': 'Christmas',
  'Santo Stefano': "St. Stephen's Day",
  'Pasqua': 'Easter',
  'Pasquetta': 'Easter Monday',
  'Chiusura estiva': 'Summer closure'
};
const DAY_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_NAMES_VEC = ['Doménega', 'Luni', 'Marti', 'Mèrcore', 'Zioba', 'Vènare', 'Sàbo'];
const MONTH_NAMES_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function getHolidaysList(today, lang) {
  const year = today.getFullYear();
  let easter = getEasterDate(year);
  let easterMonday = new Date(easter);
  easterMonday.setDate(easterMonday.getDate() + 1);
  if (today > easterMonday) {
    easter = getEasterDate(year + 1);
    easterMonday = new Date(easter);
    easterMonday.setDate(easterMonday.getDate() + 1);
  }
  const months = lang === 'en' ? MONTH_NAMES_EN : lang === 'vec' ? MONTH_NAMES_VEC : MONTH_NAMES_IT;
  const fmt = d => `${d.getDate()} ${months[d.getMonth()]}`;
  const sameMonth = easter.getMonth() === easterMonday.getMonth();
  const easterLabel = sameMonth ? `${easter.getDate()} – ${fmt(easterMonday)} ${easterMonday.getFullYear()}` : `${fmt(easter)} – ${fmt(easterMonday)} ${easterMonday.getFullYear()}`;
  const list = HOLIDAYS_BASE.map(h => h.variableEaster ? {
    name: h.name,
    date: easterLabel
  } : {
    ...h,
    date: lang === 'en' ? HOLIDAY_DATE_EN[h.name] || h.date : h.date
  });
  const today0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const extra = CHIUSURE_STRAORDINARIE.filter(c => today0 <= closureRange(c)[1]).map(c => {
    const [s, e] = closureRange(c);
    const label = s.getMonth() === e.getMonth() ? `${s.getDate()} – ${e.getDate()} ${months[e.getMonth()]} ${e.getFullYear()}` : `${fmt(s)} – ${fmt(e)} ${e.getFullYear()}`;
    return {
      name: c.name,
      date: lang === 'en' ? `${MONTH_NAMES_EN[s.getMonth()]} ${s.getDate()}–${e.getDate()}, ${e.getFullYear()}` : label
    };
  });
  return [...extra, ...list];
}
const HOLIDAY_NAME_VEC = {
  'Capodanno': 'Ano Novo',
  'Epifania': 'Befana',
  'Pasqua e Pasquetta': 'Pasqua e Pasquéta',
  'Festa della Liberazione': 'Festa de la Liberassión',
  'Festa del Lavoro': 'Festa del Laoro',
  'Festa della Repubblica': 'Festa de la Repùblica',
  'Ferragosto': 'Ferragosto',
  'Ognissanti': 'Tuti i Santi',
  'Immacolata Concezione': 'Immacolata Consessión',
  'Natale': 'Nadal',
  'Santo Stefano': 'Santo Stèfano',
  'Pasqua': 'Pasqua',
  'Pasquetta': 'Pasquéta',
  'Chiusura estiva': 'Ferie de l\'istà'
};
const HOLIDAY_DATE_EN = {
  'Capodanno': 'January 1',
  'Epifania': 'January 6',
  'Festa della Liberazione': 'April 25',
  'Festa del Lavoro': 'May 1',
  'Festa della Repubblica': 'June 2',
  'Ferragosto': 'August 15',
  'Ognissanti': 'November 1',
  'Immacolata Concezione': 'December 8',
  'Natale': 'December 25',
  'Santo Stefano': 'December 26'
};
const FIXED_HOLIDAYS = [{
  month: 1,
  day: 1,
  name: 'Capodanno'
}, {
  month: 1,
  day: 6,
  name: 'Epifania'
}, {
  month: 4,
  day: 25,
  name: 'Festa della Liberazione'
}, {
  month: 5,
  day: 1,
  name: 'Festa del Lavoro'
}, {
  month: 6,
  day: 2,
  name: 'Festa della Repubblica'
}, {
  month: 8,
  day: 15,
  name: 'Ferragosto'
}, {
  month: 11,
  day: 1,
  name: 'Ognissanti'
}, {
  month: 12,
  day: 8,
  name: 'Immacolata Concezione'
}, {
  month: 12,
  day: 25,
  name: 'Natale'
}, {
  month: 12,
  day: 26,
  name: 'Santo Stefano'
}];
const CHIUSURE_STRAORDINARIE = [{
  name: 'Chiusura estiva',
  start: [2026, 8, 12],
  end: [2026, 8, 15]
}];
function closureRange(c) {
  return [new Date(c.start[0], c.start[1] - 1, c.start[2]), new Date(c.end[0], c.end[1] - 1, c.end[2])];
}
function getClosureForDate(date) {
  const d0 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  for (const c of CHIUSURE_STRAORDINARIE) {
    const [s, e] = closureRange(c);
    if (d0 >= s && d0 <= e) return c.name;
  }
  return null;
}
function isSameCalendarDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function getHolidayNameForDate(date) {
  const closure = getClosureForDate(date);
  if (closure) return closure;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const fixed = FIXED_HOLIDAYS.find(h => h.month === month && h.day === day);
  if (fixed) return fixed.name;
  const year = date.getFullYear();
  const easter = getEasterDate(year);
  const easterMonday = new Date(easter);
  easterMonday.setDate(easter.getDate() + 1);
  if (isSameCalendarDay(date, easter)) return 'Pasqua';
  if (isSameCalendarDay(date, easterMonday)) return 'Pasquetta';
  return null;
}
function getLastSundayOfMonth(year, month) {
  const lastDay = new Date(year, month + 1, 0);
  lastDay.setDate(lastDay.getDate() - lastDay.getDay());
  lastDay.setHours(0, 0, 0, 0);
  return lastDay;
}
const MONTH_NAMES_IT = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
const MONTH_NAMES_VEC = ['zenaro', 'febraro', 'marso', 'avril', 'majo', 'zugno', 'lujo', 'agosto', 'setembre', 'otobre', 'novembre', 'disembre'];
const MONTH_NAMES_VEC_CAP = MONTH_NAMES_VEC.map(m => m.charAt(0).toUpperCase() + m.slice(1));
function getDstRangeLabel(year, seasonKind, lang) {
  const months = lang === 'en' ? MONTH_NAMES_EN : lang === 'vec' ? MONTH_NAMES_VEC : MONTH_NAMES_IT;
  const fmt = d => `${d.getDate()} ${months[d.getMonth()]}`;
  if (seasonKind === 'inverno') {
    const start = getLastSundayOfMonth(year, 9);
    const end = getLastSundayOfMonth(year + 1, 2);
    return lang === 'en' ? `from the last Sunday of October (${fmt(start)}) to the last Sunday of March ${year + 1} (${fmt(end)})` : `dall'ultima domenica di ottobre (${fmt(start)}) all'ultima domenica di marzo ${year + 1} (${fmt(end)})`;
  }
  const start = getLastSundayOfMonth(year, 2);
  const end = getLastSundayOfMonth(year, 9);
  return lang === 'en' ? `from the last Sunday of March (${fmt(start)}) to the last Sunday of October (${fmt(end)})` : `dall'ultima domenica di marzo (${fmt(start)}) all'ultima domenica di ottobre (${fmt(end)})`;
}
function getUpcomingDstRangeLabel(seasonKind, today, lang) {
  const months = lang === 'en' ? MONTH_NAMES_EN : lang === 'vec' ? MONTH_NAMES_VEC : MONTH_NAMES_IT;
  const fmt = d => `${d.getDate()} ${months[d.getMonth()]}`;
  const year = today.getFullYear();
  if (seasonKind === 'inverno') {
    let start = getLastSundayOfMonth(year, 9);
    let end = getLastSundayOfMonth(year + 1, 2);
    if (today > end) {
      start = getLastSundayOfMonth(year + 1, 9);
      end = getLastSundayOfMonth(year + 2, 2);
    }
    return `${fmt(start)} ${start.getFullYear()} – ${fmt(end)} ${end.getFullYear()}`;
  }
  let start = getLastSundayOfMonth(year, 2);
  let end = getLastSundayOfMonth(year, 9);
  if (today > end) {
    start = getLastSundayOfMonth(year + 1, 2);
    end = getLastSundayOfMonth(year + 1, 9);
  }
  return `${fmt(start)} – ${fmt(end)} ${end.getFullYear()}`;
}
function getHoursSeasonForDate(date) {
  const year = date.getFullYear();
  const summerStart = getLastSundayOfMonth(year, 2);
  const winterStart = getLastSundayOfMonth(year, 9);
  const d0 = new Date(year, date.getMonth(), date.getDate());
  if (d0 >= summerStart && d0 < winterStart) return 'estate';
  return 'inverno';
}
function isCarnevalePeriod(date) {
  const year = date.getFullYear();
  const d0 = new Date(year, date.getMonth(), date.getDate());
  const jan6 = new Date(year, 0, 6);
  const fatTuesday = getFatTuesday(year);
  return d0 >= jan6 && d0 <= fatTuesday;
}
function getTodayHoursInfo(date) {
  const holidayName = getHolidayNameForDate(date);
  if (holidayName) return {
    closed: true,
    holidayName
  };
  const seasonKey = getHoursSeasonForDate(date);
  const table = seasonKey === 'estate' ? HOURS_ESTATE : HOURS_INVERNO;
  const dayName = DAY_NAMES_IT[date.getDay()];
  const entry = table.find(e => e.day === dayName);
  return {
    closed: !!(entry && entry.closed),
    entry,
    seasonKey
  };
}
function TodayHoursBadge({
  onNavigate,
  isMobile
}) {
  const lang = useLang().lang;
  const [now] = useState(() => new Date());
  const info = React.useMemo(() => getTodayHoursInfo(now), [now]);
  const VEC_DAYS = ['Doménega', 'Luni', 'Marti', 'Mèrcore', 'Zioba', 'Vènare', 'Sàbo'];
  const VEC_MONTHS = MONTH_NAMES_VEC;
  let dateLabel;
  if (lang === 'vec') {
    dateLabel = `${VEC_DAYS[now.getDay()]} ${now.getDate()} ${VEC_MONTHS[now.getMonth()]}`;
  } else {
    dateLabel = now.toLocaleDateString(lang === 'en' ? 'en-GB' : 'it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }
  const dateLabelCap = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1);
  let statusLabel;
  if (info.closed) {
    const holidayLabel = info.holidayName ? lang === 'vec' ? HOLIDAY_NAME_VEC[info.holidayName] || info.holidayName : lang === 'en' ? HOLIDAY_NAME_EN[info.holidayName] || info.holidayName : info.holidayName : null;
    const closedWord = lang === 'vec' ? 'Serà' : lang === 'en' ? 'Closed' : 'Chiuso';
    statusLabel = holidayLabel ? `${closedWord} — ${holidayLabel}` : lang === 'vec' ? 'Serà incuò' : lang === 'en' ? 'Closed today' : 'Chiuso oggi';
  } else if (info.entry) {
    statusLabel = `${lang === 'vec' ? 'Verto' : lang === 'en' ? 'Open' : 'Aperto'} · ${info.entry.times.join(', ')}`;
  } else {
    statusLabel = '';
  }
  return React.createElement("div", {
    onClick: () => onNavigate('contact', 'hours-panel'),
    style: {
      position: 'absolute',
      top: isMobile ? 14 : 24,
      right: isMobile ? 14 : 24,
      zIndex: 3,
      background: 'rgba(26,17,8,0.55)',
      backdropFilter: 'blur(6px)',
      border: '1px solid rgba(253,250,244,0.25)',
      borderRadius: 12,
      padding: isMobile ? '8px 12px' : '10px 16px',
      cursor: 'pointer',
      textAlign: 'right',
      transition: 'background 0.2s ease'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'rgba(26,17,8,0.72)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'rgba(26,17,8,0.55)';
    }
  }, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: isMobile ? 10.5 : 11.5,
      color: '#C9A97A',
      fontStyle: 'italic',
      letterSpacing: '0.01em'
    }
  }, dateLabelCap), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: isMobile ? 12 : 13.5,
      fontWeight: 600,
      color: info.closed ? '#E8A0A0' : '#FDFAF4',
      marginTop: 2,
      whiteSpace: 'nowrap'
    }
  }, statusLabel));
}
function Hero({
  onNavigate
}) {
  const vp = useViewport();
  const {
    lang,
    setLang
  } = useLang();
  return React.createElement("section", {
    style: {
      position: 'relative',
      height: vp.isPhone ? 380 : vp.isMobile ? 440 : 560,
      overflow: 'hidden'
    }
  }, React.createElement("img", {
    src: window.IMGS.storefront,
    alt: "Gastronomia F.lli Piva",
    loading: "eager",
    decoding: "async",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center 30%'
    }
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to right, rgba(26,17,8,0.72) 0%, rgba(26,17,8,0.55) 60%, rgba(26,17,8,0.30) 100%)'
    }
  }), React.createElement(TodayHoursBadge, {
    onNavigate: onNavigate,
    isMobile: vp.isMobile
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      padding: vp.isPhone ? '0 20px' : vp.isMobile ? '0 28px' : '0 80px',
      maxWidth: 1200,
      margin: '0 auto',
      left: 0,
      right: 0
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 520
    }
  }, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 10 : 11,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: '#D4A640',
      marginBottom: vp.isMobile ? 12 : 16
    }
  }, lang === 'vec' ? 'Salumi · Roba Bòna · Cantina de Vin' : lang === 'en' ? 'Delicatessen · Prepared Foods · Wine Shop' : 'Salumeria · Gastronomia · Enoteca'), React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: vp.isPhone ? 36 : vp.isMobile ? 44 : 58,
      lineHeight: 1.08,
      letterSpacing: '-0.02em',
      color: '#FDFAF4',
      marginBottom: vp.isMobile ? 12 : 16
    }
  }, lang === 'vec' ? React.createElement(React.Fragment, null, "In cusina", React.createElement("br", null), "par voaltri") : lang === 'en' ? React.createElement(React.Fragment, null, "In the kitchen", React.createElement("br", null), "for you") : React.createElement(React.Fragment, null, "In cucina", React.createElement("br", null), "per voi")), React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: vp.isPhone ? 14 : vp.isMobile ? 15 : 18,
      color: '#E8DCC8',
      lineHeight: 1.5,
      marginBottom: vp.isMobile ? 22 : 32
    }
  }, lang === 'vec' ? React.createElement(React.Fragment, null, "Dal 1960 la fameia Piva", React.createElement("br", null), "la tien viva la tradizion a Rovigo.") : lang === 'en' ? React.createElement(React.Fragment, null, "Since 1960, the Piva family's", React.createElement("br", null), "culinary tradition in Rovigo.") : React.createElement(React.Fragment, null, "Dal 1960, la tradizione gastronomica", React.createElement("br", null), "della famiglia Piva a Rovigo.")), React.createElement("div", {
    style: {
      display: 'flex',
      gap: vp.isPhone ? 8 : 12,
      flexWrap: 'wrap'
    }
  }, React.createElement("button", {
    onClick: () => onNavigate('menu'),
    style: {
      background: '#C8251D',
      color: '#fff',
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 13 : 14,
      fontWeight: 600,
      padding: vp.isMobile ? '11px 22px' : '13px 28px',
      borderRadius: 999,
      border: 'none',
      cursor: 'pointer',
      letterSpacing: '0.04em',
      boxShadow: '0 4px 20px rgba(200,37,29,0.40)',
      transition: 'all 0.25s ease'
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 6px 28px rgba(200,37,29,0.50)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 20px rgba(200,37,29,0.40)';
    }
  }, lang === 'vec' ? 'Varda el menù' : lang === 'en' ? 'Discover our menu' : 'Scopri il menù'), React.createElement("button", {
    onClick: () => onNavigate('about'),
    style: {
      background: 'transparent',
      color: '#FDFAF4',
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 13 : 14,
      fontWeight: 500,
      padding: vp.isMobile ? '10px 18px' : '12px 24px',
      borderRadius: 999,
      border: '1.5px solid rgba(253,250,244,0.50)',
      cursor: 'pointer',
      transition: 'all 0.25s ease'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'rgba(253,250,244,0.12)';
      e.currentTarget.style.borderColor = 'rgba(253,250,244,0.8)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.borderColor = 'rgba(253,250,244,0.50)';
    }
  }, lang === 'vec' ? 'Chi sémo' : lang === 'en' ? 'About Us' : 'Chi siamo')))), React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 80,
      background: 'linear-gradient(to top, #F5F0E6, transparent)'
    }
  }));
}
const DISH_POSITIONS = {};
const MENU_DISHES = [{
  name: 'Vitello Tonnato',
  src: 'images/dishes/vitello_tonnato.jpg'
}, {
  name: 'Orecchiette',
  src: 'images/dishes/orecchiette.jpg',
  season: 'estate'
}, {
  name: 'Pasta Pomodorini Cacio e Pepe',
  src: 'images/dishes/pasta_pomodorini_cacio_e_pepe.jpg',
  season: 'estate'
}, {
  name: 'Pomodori Ripieni',
  src: 'images/dishes/pomodori_ripieni.jpg',
  season: 'estate'
}, {
  name: 'Insalata Russa',
  src: 'images/dishes/insalata_russa.jpg'
}, {
  name: 'Pasta Radicchio & Salsiccia',
  src: 'images/dishes/pasta_radicchio_salsiccia.jpg',
  season: 'estate'
}, {
  name: 'Pasta Fredda',
  src: 'images/dishes/pasta_fredda.jpg',
  season: 'estate'
}, {
  name: 'Insalata di Pasta',
  src: 'images/dishes/insalata_di_pasta.jpg',
  season: 'estate'
}, {
  name: 'Pasta Italia',
  src: 'images/dishes/pasta_italia.jpg',
  season: 'estate'
}, {
  name: 'Insalata di Riso',
  src: 'images/dishes/insalata_di_riso.jpg',
  season: 'estate'
}, {
  name: 'Insalata di Farro',
  src: 'images/dishes/insalata_di_farro.jpg',
  season: 'estate'
}, {
  name: 'Farro Vegano',
  src: 'images/dishes/farro_vegano.jpg',
  season: 'estate'
}, {
  name: 'Insalata di Mare',
  src: 'images/dishes/insalata_di_mare.jpg'
}, {
  name: 'Gnocchi di Zucca',
  src: 'images/dishes/gnocchi_di_zucca.jpg',
  season: 'inverno'
}, {
  name: 'Cipolle al Forno',
  src: 'images/dishes/cipolle_al_forno.jpg',
  season: 'estate'
}, {
  name: 'Pollo alla Piastra',
  src: 'images/dishes/pollo_alla_piastra.jpg'
}, {
  name: 'Cappelletti Mostarda',
  src: 'images/dishes/cappelletti_mostarda.jpg',
  season: 'carnevale'
}, {
  name: 'Porchetta di Nostra Produzione',
  src: 'images/dishes/porchetta_nostra_produzione.jpg'
}, {
  name: 'Scaloppine di Pollo al Marsala',
  src: 'images/dishes/scaloppine_pollo_marsala.jpg'
}, {
  name: 'Cioccolato Laica',
  src: 'images/dishes/laica_cioccolato.jpg'
}, {
  name: 'Pane di Semola Forte',
  src: 'images/dishes/pane_di_semola_forte.jpg'
}, {
  name: 'Taralli Danieli',
  src: 'images/dishes/taralli_danieli.jpg'
}, {
  name: 'Lasagne Carne',
  src: 'images/dishes/lasagne_carne.jpg'
}, {
  name: 'Lasagne con Asparagi',
  src: 'images/dishes/lasagne_con_asparagi.jpg'
}, {
  name: 'Roast Beef',
  src: 'images/dishes/roast_beef.jpg'
}, {
  name: 'Spiedi di Gamberone',
  src: 'images/dishes/spiedi_di_gamberone.jpg'
}, {
  name: 'Involtini Valdostani',
  src: 'images/dishes/involtini_valdostani.jpg'
}, {
  name: 'Zucca al Forno',
  src: 'images/dishes/zucca_al_forno.jpg',
  season: 'inverno'
}, {
  name: "Fagiolini con l'Occhio e Acciughine",
  src: 'images/dishes/fagiolini_occhio_acciughine.jpg'
}, {
  name: 'Verza con Pancetta',
  src: 'images/dishes/verza_con_pancetta.jpg',
  season: 'inverno'
}, {
  name: 'Trippa alla Parmigiana',
  src: 'images/dishes/trippa_alla_parmigiana.jpg'
}, {
  name: 'Involtini di Tacchino',
  src: 'images/dishes/involtini_di_tacchino.jpg'
}, {
  name: 'Canederli con Speck',
  src: 'images/dishes/canederli_con_speck.jpg',
  season: 'inverno'
}, {
  name: 'Baccalà alla Vicentina',
  src: 'images/dishes/baccala_alla_vicentina.jpg',
  season: 'inverno'
}, {
  name: "Sciroppo per l'inverno",
  src: "images/dishes/sciroppo_per_linverno.jpg"
}, {
  name: "Tonno di Carloforte",
  src: "images/dishes/tonno_di_carloforte.jpg"
}, {
  name: "Babbi Dolcetorta al pistacchio",
  src: "images/dishes/babbi_dolcetorta_al_pistacchio.jpg"
}, {
  name: 'Cioccolato Origine',
  src: "images/dishes/cioccolato_origine.jpg"
}, {
  name: 'Prosciutto di Parma 24 Mesi',
  src: 'images/dishes/prosciutto_di_parma_24_mesi.jpg'
}, {
  name: 'Prosciutto di San Daniele Magnum',
  src: 'images/dishes/prosciutto_san_daniele_magnum.jpg'
}, {
  name: 'Frutta in Acquavite Prunotto',
  src: 'images/dishes/frutta_acquavite_prunotto.jpg'
}, {
  name: 'Riso Acquerello 8 Anni',
  src: 'images/dishes/riso_acquerello_8_anni.jpg'
}, {
  name: 'Pinzimonio di Verdure Brezzo',
  src: 'images/dishes/pinzimonio_di_verdure_brezzo.jpg'
}, {
  name: 'Specialità di Grano',
  src: 'images/dishes/specialita_di_grano.jpg'
}, {
  name: 'Tiramisù della casa',
  src: "images/dishes/tiramisu_della_casa.jpg"
}, {
  name: 'Zuppa Inglese',
  src: 'images/dishes/zuppa_inglese.jpg'
}, {
  name: 'Porcini Tagliati Testa Nera',
  src: "images/dishes/porcini_tagliati_testa_nera.jpg"
}, {
  name: 'Crema Zabaione con Marsala',
  src: "images/dishes/crema_zabaione_con_marsala.jpg"
}, {
  name: 'Aceto Balsamico IGP Campari',
  src: "images/dishes/aceto_balsamico_igp_campari.jpg"
}, {
  name: 'Aceto Balsamico Oro Gold',
  src: "images/dishes/aceto_balsamico_oro_gold.webp"
}, {
  name: 'Confettura Extra Mistilli',
  src: "images/dishes/confettura_extra_mistilli.jpg"
}, {
  name: 'Albicocche in Grappa Brezzo',
  src: "images/dishes/albicocche_in_grappa_brezzo.jpg"
}, {
  name: 'Distillati Of Bonollo 1908',
  src: "images/dishes/grappe_of_bonollo.jpg"
}, {
  name: 'Fusilli di Pisa Martelli',
  src: "images/dishes/fusilli_di_pisa_martelli.jpg"
}, {
  name: 'Ragù di Cervo Regi',
  src: "images/dishes/ragu_di_cervo_regi.jpg"
}, {
  name: 'Grissini Il Panificio',
  src: "images/dishes/grissini_il_panificio.jpg"
}, {
  name: 'Prosecco Astoria & Fongaro',
  src: "images/dishes/prosecco_astoria_fongaro.jpg"
}, {
  name: 'Ciambelline Bergamini',
  src: "images/dishes/ciambelline_ferraresi_bergamini.jpg"
}, {
  name: 'Vini Assortiti',
  src: "images/dishes/vini_assortiti.jpg"
}, {
  name: 'Melanzane "Pizzaiola"',
  src: 'images/dishes/melanzane_pizzaiola.jpg'
}, {
  name: 'Verdure Ripiene',
  src: 'images/dishes/verdure_ripiene.jpg'
}, {
  name: 'Faraona Arrosto',
  src: 'images/dishes/faraona_arrosto.jpg',
  season: 'inverno'
}, {
  name: 'Spezzatino di Tacchino',
  src: 'images/dishes/spezzatino_di_tacchino.jpg'
}, {
  name: 'Fagioli in "Potacin"',
  src: 'images/dishes/fagioli_in_potacin.jpg',
  season: 'inverno'
}, {
  name: "Pesto d'Agrumi",
  src: 'images/dishes/pesto_dagrumi.jpg',
  season: 'estate'
}, {
  name: 'Riso Venere',
  src: 'images/dishes/riso_venere.jpg',
  season: 'estate'
}, {
  name: 'Coniglio in Salmì',
  src: 'images/dishes/coniglio_in_salmi.jpg'
}, {
  name: 'Polpettone di Vitello',
  src: 'images/dishes/arrosto_di_vitello_al_forno.jpg'
}, {
  name: 'Tacchino Farcito',
  src: 'images/dishes/tacchino_farcito.jpg'
}, {
  name: 'Arrosto di Vitello al Forno',
  src: 'images/dishes/arrosto_di_maiale_al_forno.jpg'
}, {
  name: 'Brasato al Vino',
  src: 'images/dishes/brasato_al_vino.jpg'
}, {
  name: 'Pollo con Patate',
  src: 'images/dishes/pollo_con_patate.jpg'
}, {
  name: 'Gnocchi alla Romana',
  src: 'images/dishes/gnocchi_alla_romana.jpg'
}, {
  name: 'Gnocchi alla Sorrentina',
  src: 'images/dishes/gnocchi_alla_sorrentina.jpg'
}, {
  name: 'Pasticciata',
  src: 'images/dishes/pasticciata.png'
}, {
  name: 'Stoccafisso',
  src: 'images/dishes/stoccafisso.jpg',
  season: 'inverno'
}, {
  name: 'Fondi di Carciofi',
  src: 'images/dishes/fondi_di_carciofi.jpg'
}, {
  name: 'Puré di Patate',
  src: 'images/dishes/pure_di_patate.jpg'
}, {
  name: 'Patate al Rosmarino al Forno',
  src: 'images/dishes/patate_al_rosmarino_al_forno.jpg'
}, {
  name: 'Salmone agli Agrumi',
  src: 'images/dishes/tranci_di_salmone.jpg'
}, {
  name: 'Capesante',
  src: 'images/dishes/capesante.jpg'
}, {
  name: 'Bistecca di Tonno',
  src: 'images/dishes/bistecca_di_tonno.jpg'
}, {
  name: 'Piselli',
  src: 'images/dishes/piselli.jpg'
}, {
  name: 'Spinaci',
  src: 'images/dishes/spinaci.jpg'
}, {
  name: 'Prodotti Tipici Rovigo',
  src: 'images/dishes/prodotti_tipici_rovigo.jpg'
}, {
  name: 'Selezione Champagne e Spumanti',
  src: 'images/dishes/selezione_champagne_spumanti.jpg'
}, {
  name: 'Bellavista Alma Grande Cuvée Brut',
  src: 'images/dishes/bellavista_alma_brut.jpg'
}, {
  name: "Foglie d'Ulivo agli Spinaci",
  src: 'images/dishes/foglie_ulivo_spinaci.jpg'
}, {
  name: 'Torronfetta Barbero',
  src: 'images/dishes/torronfetta_barbero.jpg'
}, {
  name: 'Marmellata di Limoni di Sicilia',
  src: 'images/dishes/marmellata_limoni_sicilia.jpg'
}, {
  name: 'Confettura di Mirtilli Brezzo',
  src: 'images/dishes/confettura_mirtilli_brezzo.jpg'
}, {
  name: "Miele all'Arancio Brezzo",
  src: 'images/dishes/miele_arancio_brezzo.jpg'
}, {
  name: 'Confetture Albicocca e Pesca Lazzaris',
  src: 'images/dishes/confetture_albicocca_pesca_lazzaris.jpg'
}, {
  name: 'Gianduiotto Fondente Barbero',
  src: 'images/dishes/gianduiotto_fondente_barbero.jpg'
}, {
  name: 'Olio Extra Vergine di Oliva Biologico Salvagno',
  src: 'images/dishes/olio_evo_biologico_salvagno.jpg'
}, {
  name: 'Fegato alla Veneziana',
  src: 'images/dishes/fegato_alla_veneziana.jpg'
}, {
  name: 'Polpettone di Carni Bianche e Verdure',
  src: 'images/dishes/polpettone_carni_bianche_verdure.jpg'
}, {
  name: 'Merluzzo in Tempura',
  src: 'images/dishes/merluzzo_in_tempura.jpg'
}, {
  name: 'Seppie con Piselli',
  src: 'images/dishes/seppie_con_piselli.jpg'
}, {
  name: 'Branzino',
  src: 'images/dishes/branzino.jpg'
}, {
  name: 'Cotolette di Pollo',
  src: 'images/dishes/cotolette_di_pollo.jpg'
}, {
  name: 'Platessa',
  src: 'images/dishes/platessa.jpg'
}, {
  name: 'Ricciola',
  src: 'images/dishes/ricciola.jpg'
}, {
  name: 'Gallinella con Pomodorini e Olive',
  src: 'images/dishes/gallinella_pomodorini_olive.jpg'
}, {
  name: 'Sugo di Pesce',
  src: 'images/dishes/sugo_di_pesce.jpg'
}, {
  name: 'Peperonata',
  src: 'images/dishes/peperonata.jpg',
  season: 'estate'
}, {
  name: 'Sarde in Saor',
  src: 'images/dishes/sarde_in_saor.jpg'
}, {
  name: 'Lenticchie',
  src: 'images/dishes/lenticchie.jpg',
  season: 'inverno'
}, {
  name: 'Polpette di Verdure',
  src: 'images/dishes/polpette_di_verdure.jpg'
}, {
  name: 'Fagioli con Cipolla',
  src: 'images/dishes/fagioli_con_cipolla.jpg',
  season: 'estate'
}, {
  name: 'Fagioli al Prezzemolo',
  src: 'images/dishes/fagioli_al_prezzemolo.jpg'
}, {
  name: 'Insalata di Orzo',
  src: 'images/dishes/insalata_di_orzo.jpg',
  season: 'estate'
}, {
  name: 'Crostata di Albicocca',
  src: 'images/dishes/crostata_di_albicocca.jpg'
}, {
  name: 'Crostata ai Frutti di Bosco',
  src: 'images/dishes/crostata_ai_frutti_di_bosco.jpg'
}, {
  name: 'Frittelle',
  src: 'images/dishes/frittelle.jpg',
  season: 'carnevale'
}, {
  name: 'Crostoli',
  src: 'images/dishes/crostoli.jpg',
  season: 'carnevale'
}, {
  name: 'Ciambella alla Ricotta',
  src: 'images/dishes/ciambella_alla_ricotta.jpg'
}, {
  name: 'Selezione di Formaggi',
  src: 'images/dishes/formaggi_misti.jpg'
}, {
  name: 'Crema di Pistacchio',
  src: 'images/dishes/crema_di_pistacchio.jpg',
  season: 'feste'
}, {
  name: 'Crema Dolce al Pistacchio',
  src: 'images/dishes/crema_dolce_al_pistacchio.jpg',
  season: 'feste'
}, {
  name: 'Torrone Assortimento',
  src: 'images/dishes/torrone_assortimento.jpg',
  season: 'feste'
}, {
  name: 'Panettone Tradizionale',
  src: 'images/dishes/panettone_tradizionale.webp',
  season: 'feste'
}, {
  name: 'Colomba Classica',
  src: 'images/dishes/colomba_classica.webp',
  season: 'pasqua'
}];
const SEASON_LABEL_VEC = {
  estate: 'Mesi Caldi',
  inverno: 'Mesi Fredi',
  carnevale: 'Carneval',
  feste: 'Nadal',
  pasqua: 'Pasqua'
};
const FESTIVE_SEASONS = ['carnevale', 'feste', 'pasqua'];
function seasonRgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
}
const SEASONS = {
  estate: {
    label: 'Mesi Caldi',
    labelEn: 'Warm Months',
    short: 'Mesi Caldi',
    shortEn: 'Warm Months',
    shortVec: 'Mesi Caldi',
    color: '#D4A640'
  },
  inverno: {
    label: 'Mesi Freddi',
    labelEn: 'Cold Months',
    short: 'Mesi Freddi',
    shortEn: 'Cold Months',
    shortVec: 'Mesi Fredi',
    color: '#5E7488'
  },
  carnevale: {
    label: 'Carnevale',
    labelEn: 'Carnival',
    short: 'Carnevale',
    shortEn: 'Carnival',
    shortVec: 'Carneval',
    color: '#C8251D'
  },
  feste: {
    label: 'Natale',
    labelEn: 'Christmas',
    short: 'Natale',
    shortEn: 'Christmas',
    shortVec: 'Nadal',
    color: '#2F5D3A'
  },
  pasqua: {
    label: 'Pasqua',
    labelEn: 'Easter',
    short: 'Pasqua',
    shortEn: 'Easter',
    shortVec: 'Pasqua',
    color: '#8E6FA6'
  }
};
function getEasterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = (h + l - 7 * m + 114) % 31 + 1;
  return new Date(year, month - 1, day);
}
function getFatTuesday(year) {
  const easter = getEasterDate(year);
  const ft = new Date(easter);
  ft.setDate(easter.getDate() - 47);
  ft.setHours(0, 0, 0, 0);
  return ft;
}
function getUpcomingCarnevaleRangeLabel(today, lang) {
  const year = today.getFullYear();
  let ft = getFatTuesday(year);
  let rangeYear = year;
  if (today > ft) {
    rangeYear = year + 1;
    ft = getFatTuesday(rangeYear);
  }
  const months = lang === 'en' ? MONTH_NAMES_EN : lang === 'vec' ? MONTH_NAMES_VEC : MONTH_NAMES_IT;
  const fmt = d => `${d.getDate()} ${months[d.getMonth()]}`;
  return lang === 'en' ? `January 6 – ${fmt(ft)} ${rangeYear}` : lang === 'vec' ? `6 zenaro – ${fmt(ft)} ${rangeYear}` : `6 gennaio – ${fmt(ft)} ${rangeYear}`;
}
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function getVisitSeed() {
  return Math.floor(Math.random() * 2 ** 31) || 1;
}
function pickRotating(list, count, seed) {
  if (list.length <= count) return list;
  const rng = mulberry32(seed);
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}
function getSeasonForDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const d0 = new Date(year, date.getMonth(), day);
  if (month === 12) return 'feste';
  if (month === 1 && day <= 6) return 'feste';
  const fatTuesday = getFatTuesday(year);
  const jan6 = new Date(year, 0, 6);
  if (d0 >= jan6 && d0 <= fatTuesday) return 'carnevale';
  const easter = getEasterDate(year);
  const pasquaStart = new Date(easter);
  pasquaStart.setDate(pasquaStart.getDate() - 21);
  if (d0 >= pasquaStart && d0 <= easter) return 'pasqua';
  const summerStart = getLastSundayOfMonth(year, 2);
  const winterStart = getLastSundayOfMonth(year, 9);
  if (d0 >= summerStart && d0 < winterStart) return 'estate';
  return 'inverno';
}
function getUpcomingFesteRangeLabel(today, lang) {
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  let startYear = y;
  if (m === 1 && today.getDate() <= 6) startYear = y - 1;
  return lang === 'en' ? `December 1, ${startYear} – January 6, ${startYear + 1}` : lang === 'vec' ? `1 disembre ${startYear} – 6 zenaro ${startYear + 1}` : `1 dicembre ${startYear} – 6 gennaio ${startYear + 1}`;
}
function getUpcomingPasquaRangeLabel(today, lang) {
  const year = today.getFullYear();
  let easter = getEasterDate(year);
  let rangeYear = year;
  if (today > easter) {
    rangeYear = year + 1;
    easter = getEasterDate(rangeYear);
  }
  const start = new Date(easter);
  start.setDate(start.getDate() - 21);
  const months = lang === 'en' ? MONTH_NAMES_EN : lang === 'vec' ? MONTH_NAMES_VEC : MONTH_NAMES_IT;
  const fmt = d => `${d.getDate()} ${months[d.getMonth()]}`;
  return `${fmt(start)} – ${fmt(easter)} ${rangeYear}`;
}
const DISH_DESCRIPTIONS = {
  'Riso Rosso': 'Riso rosso integrale con carote, zucchine e cuori di palma a dadini — insalata di riso fresca e colorata.',
  'Spiedi di Gamberone': 'Spiedini di gamberoni impanati e dorati, serviti con spicchi di limone — pronti da cuocere in forno o padella.',
  'Pasta Fredda': 'Cotto saltato in padella, pesto di pistacchio, olive verdi.',
  'Zucca al Forno': 'Fette di zucca arrostite lentamente al forno, naturalmente dolci e morbide, con un filo di olio extravergine.',
  "Fagiolini con l'Occhio e Acciughine": 'Fagioli dall\'occhio lessati e conditi con acciughe, olio extravergine e prezzemolo, secondo la tradizione contadina veneta.',
  'Verza con Pancetta': 'Verza stufata lentamente con pancetta, cipolla e un filo di olio, fino a renderla morbida e saporita.',
  'Trippa alla Parmigiana': 'Trippa cotta a lungo nel sugo di pomodoro con soffritto ed erbe aromatiche, completata con abbondante Parmigiano.',
  'Involtini di Tacchino': 'Fettine di tacchino arrotolate e rosolate in padella, sfumate nel loro fondo di cottura per una carne tenera e succosa.',
  'Canederli con Speck': 'Grandi gnocchi di pane raffermo con speck e prezzemolo, della tradizione alpina veneta. Ottimi in brodo o con burro fuso.',
  'Baccalà alla Vicentina': 'Stoccafisso cotto lentamente con cipolla, acciughe, latte e Grana, secondo la celebre ricetta vicentina. Si serve con la polenta.',
  'Vitello Tonnato': 'Tonno, maionese, vitello, capperi',
  'Orecchiette': 'Pomodori freschi, feta greca, olive, capperi, EVO',
  'Pasta Pomodorini Cacio e Pepe': 'Pomodorini, cacio e pepe, pecorino romano',
  'Pomodori Ripieni': 'Pane, EVO, prezzemolo, aglio, basilico',
  'Insalata Russa': 'Carote, piselli, patate, cetrioli, cren, maionese',
  'Pasta Radicchio & Salsiccia': 'Pasta, Radicchio, Salsiccia, Grana',
  'Insalata di Pasta': 'Tonno, Pomodoro, Basilico',
  'Pasta Italia': 'Bresaola, Grana, Philadelphia, Rucola, Pasta',
  'Insalata di Riso': 'Riso, verdure, prosciutto cotto, olive, funghi, carciofi, wurstel, giardiniera',
  'Insalata di Farro': 'Farro, verdure, olive, feta, prosciutto',
  'Farro Vegano': 'Farro perlato, piselli, carote, peperoni e cipolla saltati in padella con olio extravergine. Piatto vegano.',
  'Insalata di Mare': 'Gamberetti, calamari, polpo e seppie con sedano, carote e prezzemolo, conditi con olio extravergine e limone.',
  'Gnocchi di Zucca': 'Gnocchi di zucca mantovana e patate, impastati a mano. Si servono con burro fuso e salvia o con un velo di Grana.',
  'Cipolle al Forno': 'Cipolline borettane cotte lentamente al forno e caramellate in agrodolce, dolci e morbide.',
  'Pollo alla Piastra': 'Fettine di petto di pollo grigliate alla piastra, leggere e saporite, con un filo di olio extravergine.',
  'Cappelletti Mostarda': 'Cappelletti dolci fritti ripieni di mostarda, spolverati di zucchero a velo. Dolce della tradizione carnevalesca veneta.',
  'Porchetta di Nostra Produzione': 'Porchetta arrosto di nostra produzione, profumata con rosmarino, aglio e finocchietto, cotta lentamente fino a renderla morbida e saporita.',
  'Scaloppine di Pollo al Marsala': 'Fettine di petto di pollo cotte in padella e sfumate con Marsala, per una salsa delicata e vellutata.',
  'Cioccolato Laica': 'Cioccolato Laica, amore per il cioccolato dal 1946. Tradizione, qualità e talento da Arona.',
  'Pane di Semola Forte': 'Pane di semola rimacinata di grano duro con lievito madre, marchio Forte di Altamura. Crosta croccante e mollica soffice e profumata.',
  'Taralli Danieli': 'Taralli pugliesi fatti a mano da Danieli, il forno delle Puglie di Bitonto. Nelle varianti Cacio e Pepe, Pizza e Delizie dolci.',
  'Lasagne Carne': 'Pasta fresca, ragù, besciamella, grana',
  'Lasagne con Asparagi': 'Pasta fresca, besciamella, asparagi, cipolla, grana',
  'Roast Beef': 'Manzo, olio, sale e pepe',
  'Involtini Valdostani': 'Melanzane, prosciutto cotto, formaggio.',
  "Sciroppo per l'inverno": 'Miele italiano, propoli, olio di eucalipto e pino mugo — il rimedio naturale degli Alpi.',
  'Tonno di Carloforte': "Tonno di corsa sott'olio d'oliva, pescato e inscatolato a Carloforte. Tonnare P.I.A.M.",
  'Babbi Dolcetorta al pistacchio': 'Wafer al pistacchio rivestito di cioccolato al latte — specialità della tradizione romagnola.',
  'Cioccolato Origine': 'Tavolette di cioccolato senza zuccheri aggiunti — al latte, fondente, con nocciole o pistacchi.',
  'Prosciutto di Parma 24 Mesi': 'Prosciutto di Parma DOP stagionato 24 mesi — Battilani di Riazzi. Dolce, profumato, tagliato al coltello.',
  'Prosciutto di San Daniele Magnum': 'Prosciutto di San Daniele DOP Linea Extra Magnum — Carni Padane. Stagionatura lunga, dolce e delicato, tagliato al coltello.',
  'Frutta in Acquavite Prunotto': 'Frutta sotto spirito Mariangela Prunotto, in due gusti: ciliegie in acquavite e vinaccia di Moscato, e uva in acquavite di vinaccia di Moscato. Da gustare a fine pasto o con formaggi e dolci.',
  'Riso Acquerello 8 Anni': 'Riso Carnaroli invecchiato 8 anni — Acquerello. Chicco integro, ricco di gusto, ideale per risotti.',
  'Pinzimonio di Verdure Brezzo': 'Verdure miste lavorate dal fresco in agrodolce — Brezzo. Da gustare come antipasto o contorno.',
  'Specialità di Grano': 'Puccia, focacce e snack di grano artigianali — Cerchi di Grano al rosmarino e alla pizza, Le Figlie, Saltimbocca e Fili di Grano croccanti.',
  'Tiramisù della casa': 'Mascarpone montato, savoiardi inzuppati nel caffè, cacao amaro in superficie — preparato in casa.',
  'Zuppa Inglese': 'Crema pasticcera e cioccolato a strati con pan di Spagna imbevuto nell\'Alchermes — dolce al cucchiaio della tradizione.',
  'Porcini Tagliati Testa Nera': 'Funghi porcini testa nera tagliati, cotti a vapore senza aceto — in olio extravergine di oliva. Brezzo, Italia.',
  'Crema Zabaione con Marsala': 'Crema zabaione artigianale con Marsala — senza glutine. Panzini, pasticceri dal 1979.',
  'Aceto Balsamico IGP Campari': 'Aceto Balsamico di Modena IGP — selezione Lodovico Campari, in elegante astuccio nero.',
  'Aceto Balsamico Oro Gold': 'Aceto Balsamico di Modena IGP invecchiato — Fattoria Estense, riserva Oro Gold 250ml.',
  'Confettura Extra Mistilli': "Confetture extra artigianali Mistilli, cotte a fuoco lento con sola frutta e zucchero di canna.",
  'Albicocche in Grappa Brezzo': "Frutta intera conservata in sciroppo con grappa — la linea 'Le Grappolose' di Brezzo.",
  'Distillati Of Bonollo 1908': "La linea Of di Bonollo 1908: Of Dorange all'arancia, Grappa Of Amarone Barrique e Amaro Of. Da fine pasto, in bottiglie da collezione.",
  'Fusilli di Pisa Martelli': 'Fusilli di Pisa trafilati al bronzo — Martelli, famiglia di pastai dal 1926. Semola di grano duro, essiccazione lenta.',
  'Ragù di Cervo Regi': 'Ragù di cervo fatto in casa — Regi, specialità altoatesina. Sugo pronto, ideale per pasta e polenta.',
  'Grissini Il Panificio': "Grissini artigianali Il Panificio — linee Gran Rustico ai cereali misti e Cereali Scuri tostati, con lievito madre.",
  'Prosecco Astoria & Fongaro': 'Confezione regalo di spumanti — Carafa Prosecco DOC Treviso Astoria e Valdobbiadene Brut Fongaro, metodo classico.',
  'Ciambelline Bergamini': 'Ciambelline Ferraresi integrali — Panificio Bergamini dal 1981. Pan biscotto tradizionale, senza conservanti aggiunti.',
  'Vini Assortiti': 'Selezione di vini assortiti — rossi Valpolicella, Chianti Classico e Bardolino, bianchi Müller Thurgau, Soave e Traminer, e uno spumante Pinot Rosa.',
  'Melanzane "Pizzaiola"': 'Melanzane, farina, uova, pane, olio, pomodoro, mozzarella',
  'Verdure Ripiene': 'Zucchine, melanzane, peperoni, ricotta, grana, uova, pane',
  'Faraona Arrosto': 'Faraona, aglio, rosmarino, salvia, olio',
  'Spezzatino di Tacchino': 'Tacchino, spezie fresche, olio, limone — senza glutine',
  'Fagioli in "Potacin"': 'Fagioli, aglio, olio, pomodoro, prosciutto crudo, rosmarino',
  "Pesto d'Agrumi": "Basilico, grana, scorzette d'arancia, pomodorini",
  'Riso Venere': 'Riso venere, asparagi, gamberetti, olio',
  'Coniglio in Salmì': 'Coniglio, vino rosso, rosmarino, salvia, alloro, cipolla',
  'Polpettone di Vitello': 'Vitello, pane, latte, uova, zenzero, olio di oliva, vino bianco',
  'Tacchino Farcito': 'Tacchino, prosciutto, olive, salvia, pinoli',
  'Arrosto di Vitello al Forno': 'Vitello, olio di oliva, rosmarino, salvia',
  'Brasato al Vino': 'Manzo, vino rosso, cipolla, carota, sedano, alloro',
  'Pollo con Patate': 'Pollo, patate, rosmarino, aglio, vino bianco, olio',
  'Gnocchi alla Romana': 'Semolino, latte, burro, grana, uova',
  'Gnocchi alla Sorrentina': 'Gnocchi di patate, pomodoro, mozzarella, basilico',
  'Pasticciata': 'Pasta al forno con piselli e prosciutto cotto, besciamella e grana gratinati',
  'Stoccafisso': 'Stoccafisso, olio extravergine, aglio, prezzemolo — mantecato alla veneta',
  'Fondi di Carciofi': 'Fondi di carciofo, olio extravergine',
  'Puré di Patate': 'Patate, latte, burro, grana',
  'Patate al Rosmarino al Forno': 'Patate, rosmarino, aglio, olio extravergine, sale',
  'Salmone agli Agrumi': 'Salmone, agrumi, pepe rosa, aneto, olio extravergine',
  'Capesante': 'Capesante, gamberetti, aglio, prezzemolo, olio — gratinate',
  'Bistecca di Tonno': 'Tonno, salvia, pepe in grani, olio extravergine',
  'Piselli': 'Piselli, cipolla, olio extravergine, brodo — in tegame',
  'Spinaci': 'Spinaci freschi saltati in padella con olio extravergine e aglio.',
  'Prodotti Tipici Rovigo': 'Selezione di specialità locali: vini rossi, riso Arborio, sughi di pomodoro e altre eccellenze del territorio.',
  'Selezione Champagne e Spumanti': 'Selezione di champagne e spumanti delle migliori case: Ferrari, Veuve Clicquot, Moët & Chandon, Laurent-Perrier e Richard Cheurlin.',
  'Bellavista Alma Grande Cuvée Brut': 'Franciacorta DOCG Bellavista Alma Grande Cuvée Brut. Bollicine eleganti e persistenti, perfette per un brindisi importante.',
  'Fegato alla Veneziana': 'Fegato di vitello, cipolle, olio, prezzemolo, vino bianco',
  'Polpettone di Carni Bianche e Verdure': 'Carni bianche, carote, zucchine, grana, uova, pangrattato',
  'Merluzzo in Tempura': 'Merluzzo, pastella, olio — fritto croccante',
  'Seppie con Piselli': 'Seppie, piselli, pomodoro, cipolla, prezzemolo',
  'Branzino': 'Filetti di branzino al forno, olio extravergine, sale, pepe',
  'Cotolette di Pollo': 'Cotolette di pollo impanate e fritte, croccanti',
  'Platessa': 'Filetto di platessa impanato, croccante — da cuocere al forno o in padella',
  'Ricciola': 'Filetto di ricciola al forno con limone, rosmarino e olio extravergine. Pesce nobile dalle carni sode e delicate.',
  'Gallinella con Pomodorini e Olive': 'Filetti di gallinella in tegame con pomodorini, olive taggiasche, aglio e prezzemolo. Tipico secondo di pesce dell\'Adriatico.',
  'Sugo di Pesce': 'Sugo di mare con cozze, vongole e frutti di mare sgusciati, insaporiti con pomodoro, aglio e prezzemolo. Ideale per condire spaghetti.',
  'Peperonata': 'Peperoni, melanzane e cipolla stufati lentamente con pomodoro e olio extravergine. Contorno estivo dolce e saporito.',
  'Sarde in Saor': 'Sarde fritte marinate con cipolle stufate nell\'aceto, uvetta e pinoli. Storico piatto agrodolce della tradizione veneziana, ottimo servito il giorno dopo.',
  'Lenticchie': 'Lenticchie, cipolla, carota, sedano, olio extravergine',
  'Polpette di Verdure': 'Melanzane e mozzarella, pomodoro, zucchine, radicchio e speck, piselli e carote, rucola e pollo, grana',
  'Fagioli con Cipolla': 'Fagioli borlotti, cipolla bianca, olio extravergine, aceto',
  'Fagioli al Prezzemolo': 'Fagioli bianchi, aglio, prezzemolo, olio extravergine',
  'Insalata di Orzo': 'Orzo perlato, melanzane, zucchine, pomodorini, olio extravergine',
  'Crostata di Albicocca': 'Pasta frolla, confettura di albicocche, nocciole',
  'Crostata ai Frutti di Bosco': 'Pasta frolla, confettura di frutti di bosco, nocciole',
  'Frittelle': 'Frittelle veneziane con uvetta e crema, spolverate di zucchero a velo — dolce di Carnevale.',
  'Crostoli': 'Sottili sfoglie fritte e croccanti, spolverate di zucchero a velo — dolce di Carnevale.',
  'Ciambella alla Ricotta': 'Soffice ciambella da forno impastata con ricotta fresca, profumata al limone e ricoperta di granella di zucchero. Dolce da colazione semplice e genuino.',
  'Selezione di Formaggi': 'Un\'ampia selezione di formaggi disponibili al banco — freschi, stagionati e a pasta dura, per ogni gusto ed occasione. Chiedi al banco le disponibilità del giorno.',
  "Foglie d'Ulivo agli Spinaci": 'Pasta di semola di grano duro agli spinaci a forma di foglia d\'ulivo, delle Specialità Salvagno. Ideale con condimenti leggeri a base di olio extravergine.',
  'Torronfetta Barbero': 'Torrone friabile D. Barbero in fette sottili, disponibile con mandorle o pistacchi. Croccante e delicato, perfetto con il caffè.',
  'Marmellata di Limoni di Sicilia': 'Marmellata di limoni di Sicilia Fiasconaro, dal profumo intenso e agrumato. Ottima sulle fette biscottate o per farcire dolci.',
  'Confettura di Mirtilli Brezzo': 'Confettura di mirtilli Brezzo "La Sciroppata", lavorata a mano con frutta fresca. Ideale su crostate, formaggi e colazioni genuine.',
  "Miele all'Arancio Brezzo": 'Miele italiano Brezzo aromatizzato all\'arancio, nel vasetto con cucchiaino in legno. Delicato e profumato, perfetto per tè e tisane.',
  'Confetture Albicocca e Pesca Lazzaris': 'Confetture Lazzaris di albicocca e pesca, con solo zucchero d\'uva. Frutta selezionata dal gusto naturale e genuino.',
  'Gianduiotto Fondente Barbero': 'Gianduiotti fondenti D. Barbero di Asti, nella latta vintage da collezione. Cioccolato pregiato con nocciole del Piemonte.',
  'Olio Extra Vergine di Oliva Biologico Salvagno': 'Olio extravergine di oliva biologico Frantoio Salvagno, spremuto a freddo. Fruttato ed equilibrato, ideale a crudo.',
  'Crema di Pistacchio': 'Pesto di pistacchio Peccatucci di Mamma Andrea, da Palermo: gusto salato-dolce, perfetto su bruschette, pasta o formaggi.',
  'Crema Dolce al Pistacchio': 'Crema spalmabile dolce al pistacchio Peccatucci di Mamma Andrea, da Palermo: da gustare su pane, dolci o a cucchiaiate.',
  'Torrone Assortimento': 'Assortimento di torroncini artigianali in sei gusti — mandorla, pistacchio, cioccolato fondente e frutta candita — per un regalo goloso delle feste.',
  'Panettone Tradizionale': 'Panettone artigianale Fiasconaro, lievitato naturalmente. Disponibile in una varietà di gusti secondo la disponibilità in negozio: chiedi al banco le proposte del momento.',
  'Colomba Classica': 'Colomba artigianale Fiasconaro con canditi d\'arancia e glassa di mandorle. Disponibile in una varietà di gusti secondo la disponibilità in negozio: chiedi al banco le proposte del momento.'
};
const DISH_SUBTITLE_VEC = {
  antipasti: 'Vitèl tonà, verdure e insalate',
  primi: 'Paste, riso e faro',
  secondi: 'Roba de carne e de pese',
  dolci: 'De casa e de \'na volta',
  prodotti: 'Sielte de stagión e ofèrte'
};
const DISH_DESCRIPTIONS_VEC = {
  'Spiedi di Gamberone': 'Spedini de gamberoni impanà e dorà, co\' i tocheti de limon — pronti da còsar in forno o in tècia.',
  'Pasta Fredda': 'Prosciuto còto saltà in tècia, pesto de pistacio, olive verde.',
  'Zucca al Forno': 'Fete de suca rostìe pian pian in forno, dolse par natura e morbide, co\' un fil de ojo bon.',
  "Fagiolini con l'Occhio e Acciughine": 'Fasoi da l\'ocio lessài e conzài co\' asciughe, ojo bon e persémolo, come che i faseva i contadini de \'na volta.',
  'Verza con Pancetta': 'Verza stufàda pian co\' pancéta, zegola e un fil de ojo, fin che la vien morbida e saorìa.',
  'Trippa alla Parmigiana': 'Tripa còta a longo in tel sugo de pomodoro co\' sofrito e erbe, finìa co\' tanto Parmigian.',
  'Involtini di Tacchino': 'Fetine de tacchin involtisàe e rosolàe in tècia, sfumàe in tel so sughéto, tenare e sugose.',
  'Canederli con Speck': 'Gnochi grossi de pan seco co\' speck e persémolo, roba de montagna. Bòni in brodo o co\' buro fuso.',
  'Baccalà alla Vicentina': 'Stocafisso còto pian co\' zegola, asciughe, late e Grana, come vol la ricéta de Visensa. Se magna co\' la polenta.',
  'Vitello Tonnato': 'Ton, maionese, vitèl, càpari',
  'Orecchiette': 'Pomodori freschi, feta greca, olive, càpari, ojo bon',
  'Pasta Pomodorini Cacio e Pepe': 'Pomarini, cacio e pévare, pecorin roman',
  'Pomodori Ripieni': 'Pan, ojo bon, persémolo, ajo, basìlico',
  'Insalata Russa': 'Carote, bisi, patate, cogómbari, cren, maionese',
  'Pasta Radicchio & Salsiccia': 'Pasta, radicio, luganega, Grana',
  'Insalata di Pasta': 'Ton, pomodoro, basìlico',
  'Pasta Italia': 'Bresaola, Grana, Philadelphia, rucola, pasta',
  'Insalata di Riso': 'Riso, verdure, prosciuto còto, olive, fonghi, articiochi, wurstel, giardiniera',
  'Insalata di Farro': 'Faro, verdure, olive, feta, prosciuto',
  'Farro Vegano': 'Faro perlà, bisi, carote, peperoni e zegola saltài in tècia co\' ojo bon. Piato tuto vegetal.',
  'Insalata di Mare': 'Gamberéti, calamari, folpo e sépe co\' selino, carote e persémolo, conzài co\' ojo bon e limon.',
  'Gnocchi di Zucca': 'Gnochi de suca mantovana e patate, fati a man. Se serve co\' buro fuso e salvia o co\' un fil de Grana.',
  'Cipolle al Forno': 'Zegolete borretane còte pian in forno e caramelàe in agrodolse, dolse e morbide.',
  'Pollo alla Piastra': 'Fetine de peto de polastro grilàe su la piastra, lisiere e saorìe, co\' un fil de ojo bon.',
  'Cappelletti Mostarda': 'Capeléti dolsi friti co\' drento la mostarda, co\' su el zùcaro a vélo. Dolse de Carneval de \'na volta.',
  'Porchetta di Nostra Produzione': 'Porchéta rostìa fata da nualtri, profumàda co\' rosmarin, ajo e finociéto, còta pian fin che la vien morbida e saorìa.',
  'Scaloppine di Pollo al Marsala': 'Fetine de peto de polastro còte in tècia e sfumàe co\' Marsala, par \'na salsa delicàda e velutàda.',
  'Cioccolato Laica': 'Ciocolàto Laica, amor par el ciocolàto dal 1946. Tradissión e qualità da Arona.',
  'Pane di Semola Forte': 'Pan de semola de gran duro co\' lievito madre, marca Forte de Altamura. Crosta crocante e mòlica morbida e profumàda.',
  'Taralli Danieli': 'Taralli pugliesi fati a man da Danieli, el forno de le Puglie de Bitonto. Cacio e Pévare, Pissa e Delisie dolsi.',
  'Lasagne Carne': 'Pasta fresca, ragù, besciamela, Grana',
  'Lasagne con Asparagi': 'Pasta fresca, besciamela, sparasi, zegola, Grana',
  'Roast Beef': 'Manzo, ojo, sal e pévare',
  'Involtini Valdostani': 'Melansane, prosciuto còto, formajo.',
  "Sciroppo per l'inverno": 'Miel italian, própoli, ojo de eucalipto e pin mugo — el rimedio natural de le montagne.',
  'Tonno di Carloforte': 'Ton de corsa soto ojo d\'oliva, ciapà e inscatolà a Carloforte. Tonnare P.I.A.M.',
  'Babbi Dolcetorta al pistacchio': 'Wafer al pistacio investìo de ciocolàto al late — specialità de la Romagna.',
  'Cioccolato Origine': 'Tavolete de ciocolàto sensa zùcaro zontà — al late, fondente, co\' nosele o pistaci.',
  'Prosciutto di Parma 24 Mesi': 'Prosciuto de Parma DOP stagionà 24 mesi — Battilani de Riazzi. Dolse, profumà, tajà col cortèl.',
  'Prosciutto di San Daniele Magnum': 'Prosciuto de San Daniele DOP Linea Extra Magnum — Carni Padane. Stagionà a longo, dolse e delicà, tajà col cortèl.',
  'Frutta in Acquavite Prunotto': 'Fruta soto spìrito Mariangela Prunotto, in do gusti: siriese in acquavita e vinacia de Moscato, e ua in acquavita de vinacia de Moscato. Da magnar a fin pasto o co\' formaji e dolsi.',
  'Riso Acquerello 8 Anni': 'Riso Carnaroli invecià 8 ani — Acquerello. Graneo intiero, pien de gusto, giusto par i risoti.',
  'Pinzimonio di Verdure Brezzo': 'Verdure misse lavoràe dal fresco in agrodolse — Brezzo. Da magnar come antipasto o contorno.',
  'Specialità di Grano': 'Puccia, focace e snack de gran fati a man — Cerchi de Grano al rosmarin e a la pissa, Le Figlie, Saltimbocca e Fili de Grano crocanti.',
  'Tiramisù della casa': 'Mascarpon montà, savoiardi bagnài in tel cafè, cacao amaro de sora — fato in casa.',
  'Zuppa Inglese': 'Crema e ciocolàto a strati co\' pan de Spagna bagnà in te l\'Alchermes — dolse col cuciaro de \'na volta.',
  'Porcini Tagliati Testa Nera': 'Fonghi porsini testa nera tajài, còti a vapor sensa aseo — in ojo bon. Brezzo, Italia.',
  'Crema Zabaione con Marsala': 'Crema zabajon fata a man co\' Marsala — sensa glutine. Panzini, pasticieri dal 1979.',
  'Aceto Balsamico IGP Campari': 'Aseo Balsàmico de Modena IGP — sielta Lodovico Campari, in te l\'astucio nero elegante.',
  'Aceto Balsamico Oro Gold': 'Aseo Balsàmico de Modena IGP invecià — Fattoria Estense, riserva Oro Gold 250ml.',
  'Confettura Extra Mistilli': 'Confeture extra fate a man Mistilli, còte pian co\' sol fruta e zùcaro de cana.',
  'Albicocche in Grappa Brezzo': 'Fruta intiera tegnùa in tel siropo co\' la grapa — la linea "Le Grappolose" de Brezzo.',
  'Distillati Of Bonollo 1908': 'La linea Of de Bonollo 1908: Of Dorange co\' l\'arancio, Grapa Of Amarone Barrique e Amaro Of. Da finir el disnar, in botilie da colession.',
  'Fusilli di Pisa Martelli': 'Fusilli de Pisa tirài al bronzo — Martelli, fameia de pastari dal 1926. Semola de gran duro, sugà pian.',
  'Ragù di Cervo Regi': 'Ragù de servo fato in casa — Regi, specialità de l\'Alto Adige. Sugo pronto, giusto par pasta e polenta.',
  'Grissini Il Panificio': 'Grissini fati a man Il Panificio — Gran Rustico ai cereali missi e Cereali Scuri tostài, co\' lievito madre.',
  'Prosecco Astoria & Fongaro': 'Pachéto regalo de spumanti — Carafa Prosecco DOC Treviso Astoria e Valdobbiadene Brut Fongaro, metodo classico.',
  'Ciambelline Bergamini': 'Ciambeline Ferraresi integrali — Panificio Bergamini dal 1981. Pan biscoto de \'na volta, sensa conservanti zontà.',
  'Vini Assortiti': 'Sielta de vini missi — rossi Valpolicella, Chianti Classico e Bardolino, bianchi Müller Thurgau, Soave e Traminer, e un spumante Pinot Rosa.',
  'Melanzane "Pizzaiola"': 'Melansane, farina, ovi, pan, ojo, pomodoro, mozzarela',
  'Verdure Ripiene': 'Sucine, melansane, peperoni, ricota, Grana, ovi, pan',
  'Faraona Arrosto': 'Faraona, ajo, rosmarin, salvia, ojo',
  'Spezzatino di Tacchino': 'Tacchin, spèsie fresche, ojo, limon — sensa glutine',
  'Fagioli in "Potacin"': 'Fasoi, ajo, ojo, pomodoro, prosciuto crudo, rosmarin',
  "Pesto d'Agrumi": 'Basìlico, Grana, scorsete de naranza, pomarini',
  'Riso Venere': 'Riso venere, sparasi, gamberéti, ojo',
  'Coniglio in Salmì': 'Conéjo, vin rosso, rosmarin, salvia, alloro, zegola',
  'Polpettone di Vitello': 'Vitèl, pan, late, ovi, zenzevero, ojo de oliva, vin bianco',
  'Tacchino Farcito': 'Tacchin, prosciuto, olive, salvia, pinoli',
  'Arrosto di Vitello al Forno': 'Vitèl, ojo de oliva, rosmarin, salvia',
  'Brasato al Vino': 'Manzo, vin rosso, zegola, carota, selino, alloro',
  'Pollo con Patate': 'Polastro, patate, rosmarin, ajo, vin bianco, ojo',
  'Gnocchi alla Romana': 'Semolin, late, butiro, Grana, ovi',
  'Gnocchi alla Sorrentina': 'Gnochi de patate, pomodoro, mozzarela, basìlico',
  'Pasticciata': 'Pasta al forno co\' bisi e prosciuto còto, besciamela e Grana gratinài',
  'Stoccafisso': 'Stocafisso, ojo bon, ajo, persémolo — mantecà a la veneta',
  'Fondi di Carciofi': 'Fondi de articioco, ojo bon',
  'Puré di Patate': 'Patate, late, butiro, Grana',
  'Patate al Rosmarino al Forno': 'Patate, rosmarin, ajo, ojo bon, sal',
  'Salmone agli Agrumi': 'Salmon, agrumi, pévare rosa, aneto, ojo bon',
  'Capesante': 'Capesante, gamberéti, ajo, persémolo, ojo — gratinàe',
  'Bistecca di Tonno': 'Ton, salvia, pévare in grani, ojo bon',
  'Piselli': 'Bisi, zegola, ojo bon, brodo — in tècia',
  'Spinaci': 'Spinasse fresche saltàe in tècia co\' ojo bon e ajo.',
  'Prodotti Tipici Rovigo': 'Sielta de robe nostrane: vini rossi, riso Arborio, sughi de pomodoro e altre bontà del teritorio.',
  'Selezione Champagne e Spumanti': 'Sielta de champagne e spumanti de le mèjo case: Ferrari, Veuve Clicquot, Moët & Chandon, Laurent-Perrier e Richard Cheurlin.',
  'Bellavista Alma Grande Cuvée Brut': 'Franciacorta DOCG Bellavista Alma Grande Cuvée Brut. Bolesine eleganti e persistenti, giuste par un brindisi importante.',
  'Fegato alla Veneziana': 'Figà de vitèl, zegoe, ojo, persémolo, vin bianco',
  'Polpettone di Carni Bianche e Verdure': 'Carne bianca, carote, sucine, Grana, ovi, pan gratà',
  'Merluzzo in Tempura': 'Merlusso, pastèla, ojo — frito crocante',
  'Seppie con Piselli': 'Sépe, bisi, pomodoro, zegola, persémolo',
  'Branzino': 'Fileti de branzin al forno, ojo bon, sal, pévare',
  'Cotolette di Pollo': 'Cotolete de polastro impanàe e frite, crocanti',
  'Platessa': 'Fileto de platessa impanà, crocante — da còsar al forno o in tècia',
  'Ricciola': 'Fileto de ricciola al forno co\' limon, rosmarin e ojo bon. Pesse fin da le carne sòde e delicàe.',
  'Gallinella con Pomodorini e Olive': 'Fileti de galinèla in tècia co\' pomarini, olive taggiasche, ajo e persémolo. Tipico secondo de pese de l\'Adriàtico.',
  'Sugo di Pesce': 'Sugo de mar co\' peóci, càpe e fruti de mar sgusài, insaorìi co\' pomodoro, ajo e persémolo. Giusto par condir i spaghéti.',
  'Peperonata': 'Peperoni, melansane e zegola stufài pian co\' pomodoro e ojo bon. Contorno de istà, dolse e saorìo.',
  'Sarde in Saor': 'Sardee frite marinàe co\' zegoe stufàe in te l\'aseo, ua passa e pinoli. Piato agrodolse de \'na volta, ancora mèjo el dì dopo.',
  'Lenticchie': 'Lentìce, zegola, carota, selino, ojo bon',
  'Polpette di Verdure': 'Melanzane e mozzarela, pomodoro, sucine, radicio e speck, bisi e carote, rucola e polo, Grana',
  'Fagioli con Cipolla': 'Fasoi borlòti, zegola bianca, ojo bon, aseo',
  'Fagioli al Prezzemolo': 'Fasoi bianchi, ajo, persémolo, ojo bon',
  'Insalata di Orzo': 'Orzo perlà, melansane, sucine, pomarini, ojo bon',
  'Crostata di Albicocca': 'Pasta frola, confetura de armelini, nosele',
  'Crostata ai Frutti di Bosco': 'Pasta frola, confetura de fruti de bosco, nosele',
  'Frittelle': 'Fritole venesiane co\' ua passa e crema, co\' su el zùcaro a vélo — dolse de Carneval.',
  'Crostoli': 'Sfoje sotìe frite e crocanti, co\' su el zùcaro a vélo — dolse de Carneval.',
  'Ciambella alla Ricotta': 'Ciambèla morbida da forno co\' ricota fresca, profumàda al limon e coverta de granèla de zùcaro. Dolse da colassión sémplice e genuin.',
  'Selezione di Formaggi': 'Un bel po\' de formaji al banco — freschi, stagionài e duri, par tuti i gusti e ocasión. Domanda al banco cosa che ghe xe incuò.',
  "Foglie d'Ulivo agli Spinaci": 'Pasta de semola de gran duro co\' spinasse a forma de foja d\'ulivo, de le Specialità Salvagno. Giusta co\' condimenti lisieri de ojo bon.',
  'Torronfetta Barbero': 'Torón friàbile D. Barbero in fete sotìe, co\' màndole o pistaci. Crocante e delicà, giusto col cafè.',
  'Marmellata di Limoni di Sicilia': 'Marmelàda de limoni de Sicilia Fiasconaro, profumàda e agrumàda. Bòna su le fete biscotàe o par farsir i dolsi.',
  'Confettura di Mirtilli Brezzo': 'Confetura de mirtili Brezzo "La Sciroppata", lavoràda a man co\' fruta fresca. Giusta su crostate, formaji e colassión genuine.',
  "Miele all'Arancio Brezzo": 'Miel italian Brezzo profumà a la naranza, in tel vaséto col cuciarin de legno. Delicà, giusto par tè e tisane.',
  'Confetture Albicocca e Pesca Lazzaris': 'Confeture Lazzaris de armelin e persego, co\' sol zùcaro d\'ua. Fruta sielta dal gusto natural e genuin.',
  'Gianduiotto Fondente Barbero': 'Gianduioti fondenti D. Barbero de Asti, in te la lata vintage da colessión. Ciocolàto fin co\' nosele del Piemonte.',
  'Olio Extra Vergine di Oliva Biologico Salvagno': 'Ojo estravèrgine biologico Frantoio Salvagno, sprémù a fredo. Fruità e equilibrà, giusto a crudo.',
  'Crema di Pistacchio': 'Pesto de pistacio Peccatucci de Mamma Andrea, da Palermo: gusto salà-dolse, giusto su bruschéte, pasta o formaji.',
  'Crema Dolce al Pistacchio': 'Crema dolse da spalmar al pistacio Peccatucci de Mamma Andrea, da Palermo: da magnar su pan, dolsi o a cuciaràe.',
  'Torrone Assortimento': 'Assortimento de toroncini fati a man in sie gusti — màndola, pistacio, ciocolàto fondente e fruta candìa — par un regalo goloso de le feste.',
  'Panettone Tradizionale': 'Panetón fato a man Fiasconaro, levà par natura. Ghe n\'è de vari gusti secondo cosa che ghe xe in botéga: domanda al banco cosa che gh\'è incuò.',
  'Colomba Classica': 'Colomba fata a man Fiasconaro co\' candìi de naranza e glassa de màndole. Ghe n\'è de vari gusti secondo cosa che ghe xe in botéga: domanda al banco cosa che gh\'è incuò.'
};
const DISH_NAME_VEC = {
  "Foglie d'Ulivo agli Spinaci": 'Foie de Ulivo',
  'Olio Extra Vergine di Oliva Biologico Salvagno': 'Oio de Oliva',
  'Crema Zabaione con Marsala': 'Crema Zabaion',
  'Tonno di Carloforte': 'Ton Carloforte',
  'Pasticciata': "Pasticcio co' la carne",
  'Vini Assortiti': 'Vini Assortìi',
  'Prodotti Tipici Rovigo': 'Roba Nostrana de Rovigo',
  'Selezione di Formaggi': 'Sielta de Formaji',
  'Selezione Champagne e Spumanti': 'Sielta de Champagne e Spumanti',
  'Torrone Assortimento': 'Assortimento de Torón',
  'Panettone Tradizionale': 'Panetón Tradissional',
  'Colomba Classica': 'Colomba Clàssica',
  'Zucca al Forno': 'Suca al Forno',
  'Verza con Pancetta': "Verza co' la Pancéta",
  'Cipolle al Forno': 'Zegoe al Forno',
  'Pollo alla Piastra': 'Polastro a la Piastra',
  'Pomodori Ripieni': 'Pomodori Impinìi',
  'Verdure Ripiene': 'Verdure Impinìe',
  'Insalata di Riso': 'Insalata de Riso',
  'Insalata di Farro': 'Insalata de Faro',
  'Insalata di Pasta': 'Insalata de Pasta',
  'Insalata di Mare': 'Insalata de Mar',
  'Insalata di Orzo': 'Insalata de Orzo',
  'Fagioli con Cipolla': "Fasoi co' la Zegola",
  'Fagioli al Prezzemolo': 'Fasoi al Persémolo',
  "Fagiolini con l'Occhio e Acciughine": "Fasoi da l'Ocio e Asciughe",
  'Fagioli in "Potacin"': 'Fasoi in Potacin',
  'Spinaci': 'Spinasse',
  'Piselli': 'Bisi',
  'Lenticchie': 'Lentéce',
  'Puré di Patate': 'Puré de Patate',
  'Patate al Rosmarino al Forno': 'Patate al Rosmarin al Forno',
  'Polpette di Verdure': 'Polpéte de Verdure',
  "Pesto d'Agrumi": 'Pesto de Agrumi',
  'Fondi di Carciofi': 'Fondi de Articiochi',
  'Pasta Fredda': 'Pasta Freda',
  'Pasta Radicchio & Salsiccia': 'Pasta Radicio & Luganega',
  'Gnocchi di Zucca': 'Gnochi de Suca',
  'Gnocchi alla Romana': 'Gnochi a la Romana',
  'Gnocchi alla Sorrentina': 'Gnochi a la Sorentina',
  'Lasagne Carne': 'Lasagne de Carne',
  'Lasagne con Asparagi': "Lasagne co' i Sparasi",
  'Sugo di Pesce': 'Sugo de Pesse',
  'Faraona Arrosto': 'Faraona Rostìa',
  'Spezzatino di Tacchino': 'Spesatin de Tachin',
  'Coniglio in Salmì': 'Conéjo in Salmì',
  'Polpettone di Vitello': 'Polpetòn de Vedeo',
  'Tacchino Farcito': 'Tachin Impinìo',
  'Arrosto di Vitello al Forno': "Rosto de Maiae al Forno",
  'Brasato al Vino': 'Brasà al Vin',
  'Pollo con Patate': "Polastro co' le Patate",
  'Fegato alla Veneziana': 'Figà a la Venessiana',
  'Merluzzo in Tempura': 'Merlusso in Tempura',
  'Seppie con Piselli': "Sépe co' i Bisi",
  'Cotolette di Pollo': 'Cotolete de Polastro',
  'Bistecca di Tonno': 'Bistéca de Ton',
  'Salmone agli Agrumi': 'Salmon co’ i Agrumi',
  'Sarde in Saor': 'Sardee in Saor',
  'Gallinella con Pomodorini e Olive': "Galinèla co' Pomarini e Olive",
  'Scaloppine di Pollo al Marsala': 'Scalopine de Polastro al Marsala',
  'Involtini di Tacchino': 'Involtini de Tachin',
  'Porchetta di Nostra Produzione': 'Porchéta Fata da Nualtri',
  'Trippa alla Parmigiana': 'Tripa a la Parmigiana',
  'Baccalà alla Vicentina': 'Bacalá ala Vicentina',
  'Polpettone di Carni Bianche e Verdure': 'Polpetón de Carne Bianca e Verdure',
  'Spiedi di Gamberone': 'Spiedini de Gambaron',
  'Stoccafisso': 'Stocafisso',
  'Tiramisù della casa': 'Tiramisù de la Casa',
  'Crostata di Albicocca': 'Crostata de Armelini',
  'Crostata ai Frutti di Bosco': 'Crostata ai Fruti de Bosco',
  'Frittelle': 'Fritole',
  'Ciambella alla Ricotta': 'Ciambèla a la Ricota',
  'Cappelletti Mostarda': "Capeléti co' la Mostarda"
};
const DISH_NAME_EN = {
  'Riso Rosso': 'Red Rice Salad',
  'Vitello Tonnato': 'Vitello Tonnato',
  'Orecchiette': 'Orecchiette',
  'Pasta Pomodorini Cacio e Pepe': 'Pasta with Cherry Tomatoes, Cacio e Pepe',
  'Pomodori Ripieni': 'Stuffed Tomatoes',
  'Insalata Russa': 'Russian Salad',
  'Pasta Radicchio & Salsiccia': 'Pasta with Radicchio & Sausage',
  'Pasta Fredda': 'Cold Pasta Salad',
  'Insalata di Pasta': 'Pasta Salad',
  'Pasta Italia': 'Pasta Italia',
  'Insalata di Riso': 'Rice Salad',
  'Insalata di Farro': 'Farro Salad',
  'Farro Vegano': 'Vegan Farro Salad',
  'Insalata di Mare': 'Seafood Salad',
  'Gnocchi di Zucca': 'Pumpkin Gnocchi',
  'Cipolle al Forno': 'Baked Onions',
  'Pollo alla Piastra': 'Grilled Chicken',
  'Cappelletti Mostarda': 'Sweet Cappelletti with Mostarda',
  'Porchetta di Nostra Produzione': 'House-Made Porchetta',
  'Scaloppine di Pollo al Marsala': 'Chicken Scaloppine in Marsala',
  'Cioccolato Laica': 'Laica Chocolate',
  'Pane di Semola Forte': 'Semolina Bread',
  'Taralli Danieli': 'Danieli Taralli',
  'Lasagne Carne': 'Meat Lasagna',
  'Lasagne con Asparagi': 'Asparagus Lasagna',
  'Roast Beef': 'Roast Beef',
  'Spiedi di Gamberone': 'King Prawn Skewers',
  'Involtini Valdostani': 'Valdostana Rolls',
  'Zucca al Forno': 'Roasted Pumpkin',
  "Fagiolini con l'Occhio e Acciughine": 'Black-Eyed Beans with Anchovies',
  'Verza con Pancetta': 'Savoy Cabbage with Pancetta',
  'Trippa alla Parmigiana': 'Tripe alla Parmigiana',
  'Involtini di Tacchino': 'Turkey Rolls',
  'Canederli con Speck': 'Speck Dumplings',
  'Baccalà alla Vicentina': 'Baccalà alla Vicentina',
  "Sciroppo per l'inverno": 'Winter Syrup',
  'Tonno di Carloforte': 'Carloforte Tuna',
  'Babbi Dolcetorta al pistacchio': 'Pistachio Wafer Cake',
  'Cioccolato Origine': 'Origin Chocolate',
  'Prosciutto di Parma 24 Mesi': '24-Month Parma Ham',
  'Prosciutto di San Daniele Magnum': 'San Daniele Magnum Ham',
  'Frutta in Acquavite Prunotto': 'Prunotto Fruit in Spirits',
  'Riso Acquerello 8 Anni': '8-Year Aged Acquerello Rice',
  'Pinzimonio di Verdure Brezzo': 'Sweet & Sour Vegetables',
  'Specialità di Grano': 'Wheat Specialties',
  'Tiramisù della casa': 'House Tiramisù',
  'Zuppa Inglese': 'Zuppa Inglese Custard Trifle',
  'Porcini Tagliati Testa Nera': 'Sliced Porcini Mushrooms',
  'Crema Zabaione con Marsala': 'Zabaione Cream with Marsala',
  'Aceto Balsamico IGP Campari': 'Balsamic Vinegar IGP — Campari',
  'Aceto Balsamico Oro Gold': 'Balsamic Vinegar — Oro Gold',
  'Confettura Extra Mistilli': 'Mixed Berry Jam',
  'Albicocche in Grappa Brezzo': 'Apricots in Grappa',
  'Distillati Of Bonollo 1908': 'Bonollo Of Spirits',
  'Fusilli di Pisa Martelli': 'Martelli Fusilli',
  'Ragù di Cervo Regi': 'Venison Ragù',
  'Grissini Il Panificio': 'Breadsticks',
  'Prosecco Astoria & Fongaro': 'Prosecco Gift Set',
  'Ciambelline Bergamini': 'Bergamini Ciambelline',
  'Vini Assortiti': 'Assorted Wines',
  'Melanzane "Pizzaiola"': 'Eggplant "Pizzaiola"',
  'Verdure Ripiene': 'Stuffed Vegetables',
  'Faraona Arrosto': 'Roast Guinea Fowl',
  'Spezzatino di Tacchino': 'Turkey Stew',
  'Fagioli in "Potacin"': 'Beans in "Potacin" Sauce',
  "Pesto d'Agrumi": 'Citrus Pesto',
  'Riso Venere': 'Venere Black Rice',
  'Coniglio in Salmì': 'Rabbit in Salmì',
  'Polpettone di Vitello': 'Veal Meatloaf',
  'Tacchino Farcito': 'Stuffed Turkey',
  'Arrosto di Vitello al Forno': 'Roast Pork',
  'Brasato al Vino': 'Wine-Braised Beef',
  'Pollo con Patate': 'Chicken with Potatoes',
  'Gnocchi alla Romana': 'Gnocchi alla Romana',
  'Gnocchi alla Sorrentina': 'Gnocchi alla Sorrentina',
  'Pasticciata': 'Pasticciata',
  'Stoccafisso': 'Stockfish',
  'Fondi di Carciofi': 'Artichoke Hearts',
  'Puré di Patate': 'Mashed Potatoes',
  'Patate al Rosmarino al Forno': 'Roasted Rosemary Potatoes',
  'Salmone agli Agrumi': 'Citrus Salmon',
  'Capesante': 'Scallops',
  'Bistecca di Tonno': 'Tuna Steak',
  'Piselli': 'Peas',
  'Spinaci': 'Spinach',
  'Prodotti Tipici Rovigo': 'Local Rovigo Products',
  'Selezione Champagne e Spumanti': 'Champagne & Sparkling Wine Selection',
  'Bellavista Alma Grande Cuvée Brut': 'Bellavista Franciacorta Brut',
  'Fegato alla Veneziana': 'Venetian-Style Liver',
  'Polpettone di Carni Bianche e Verdure': 'White Meat & Vegetable Meatloaf',
  'Merluzzo in Tempura': 'Cod Tempura',
  'Seppie con Piselli': 'Cuttlefish with Peas',
  'Branzino': 'Sea Bass',
  'Cotolette di Pollo': 'Chicken Cutlets',
  'Platessa': 'Plaice',
  'Ricciola': 'Amberjack',
  'Gallinella con Pomodorini e Olive': 'Gurnard with Cherry Tomatoes & Olives',
  'Sugo di Pesce': 'Seafood Sauce',
  'Peperonata': 'Peperonata',
  'Sarde in Saor': 'Sarde in Saor',
  'Lenticchie': 'Lentils',
  'Polpette di Verdure': 'Vegetable Meatballs',
  'Fagioli con Cipolla': 'Beans with Onion',
  'Fagioli al Prezzemolo': 'Beans with Parsley',
  'Insalata di Orzo': 'Barley Salad',
  'Fagioli con Cipolla': 'Beans with Onion',
  'Crostata di Albicocca': 'Apricot Tart',
  'Crostata ai Frutti di Bosco': 'Mixed Berry Tart',
  'Frittelle': 'Carnival Fritters',
  'Crostoli': 'Crostoli',
  'Ciambella alla Ricotta': 'Ricotta Ring Cake',
  'Selezione di Formaggi': 'Cheese Selection',
  "Foglie d'Ulivo agli Spinaci": 'Spinach Olive-Leaf Pasta',
  'Torronfetta Barbero': 'Barbero Nougat Slices',
  'Marmellata di Limoni di Sicilia': 'Sicilian Lemon Marmalade',
  'Confettura di Mirtilli Brezzo': 'Brezzo Blueberry Jam',
  "Miele all'Arancio Brezzo": 'Brezzo Orange Honey',
  'Confetture Albicocca e Pesca Lazzaris': 'Lazzaris Apricot & Peach Jams',
  'Gianduiotto Fondente Barbero': 'Barbero Dark Gianduiotto',
  'Olio Extra Vergine di Oliva Biologico Salvagno': 'Salvagno Organic Extra Virgin Olive Oil',
  'Crema di Pistacchio': 'Pistachio Pesto',
  'Crema Dolce al Pistacchio': 'Sweet Pistachio Spread',
  'Torrone Assortimento': 'Assorted Torrone',
  'Panettone Tradizionale': 'Panettone',
  'Colomba Classica': 'Colomba'
};
const DISH_DESCRIPTIONS_EN = {
  'Spiedi di Gamberone': 'Breaded, golden king prawn skewers served with lemon wedges — ready to cook in the oven or pan.',
  'Pasta Fredda': 'Pan-tossed ham, pistachio pesto, green olives.',
  'Zucca al Forno': 'Slow-roasted pumpkin slices, naturally sweet and soft, with a drizzle of extra virgin olive oil.',
  "Fagiolini con l'Occhio e Acciughine": "Black-eyed beans boiled and dressed with anchovies, olive oil and parsley, in the Venetian country tradition.",
  'Verza con Pancetta': 'Savoy cabbage slowly stewed with pancetta, onion and a drizzle of oil, until soft and flavorful.',
  'Trippa alla Parmigiana': 'Tripe simmered at length in tomato sauce with soffritto and herbs, finished with plenty of Parmigiano.',
  'Involtini di Tacchino': "Turkey slices rolled and browned in the pan, deglazed in their own juices for tender, juicy meat.",
  'Canederli con Speck': 'Large stale-bread dumplings with speck and parsley, an Alpine Venetian tradition. Great in broth or with melted butter.',
  'Baccalà alla Vicentina': 'Stockfish slow-cooked with onion, anchovies, milk and Grana, following the famous Vicenza recipe. Served with polenta.',
  'Vitello Tonnato': 'Tuna, mayonnaise, veal, capers',
  'Orecchiette': 'Fresh tomatoes, Greek feta, olives, capers, EVO',
  'Pasta Pomodorini Cacio e Pepe': 'Cherry tomatoes, cacio e pepe, pecorino romano',
  'Pomodori Ripieni': 'Bread, EVO, parsley, garlic, basil',
  'Insalata Russa': 'Carrots, peas, potatoes, cucumbers, horseradish, mayonnaise',
  'Pasta Radicchio & Salsiccia': 'Pasta, radicchio, sausage, Grana',
  'Insalata di Pasta': 'Tuna, tomato, basil',
  'Pasta Italia': 'Bresaola, Grana, Philadelphia, arugula, pasta',
  'Insalata di Riso': 'Rice, vegetables, cooked ham, olives, mushrooms, artichokes, wurstel, pickled vegetables',
  'Insalata di Farro': 'Farro, vegetables, olives, feta, ham',
  'Farro Vegano': 'Pearl farro, peas, carrots, peppers and onion sautéed in extra virgin olive oil. Vegan dish.',
  'Insalata di Mare': 'Shrimp, squid, octopus and cuttlefish with celery, carrots and parsley, dressed with olive oil and lemon.',
  'Gnocchi di Zucca': 'Hand-made gnocchi of Mantuan pumpkin and potatoes. Served with melted butter and sage or a dusting of Grana.',
  'Cipolle al Forno': 'Small borettane onions slow-baked and caramelized sweet-and-sour, tender and soft.',
  'Pollo alla Piastra': 'Grilled chicken breast slices, light and flavorful, with a drizzle of extra virgin olive oil.',
  'Cappelletti Mostarda': 'Sweet fried cappelletti filled with mostarda, dusted with icing sugar. A traditional Venetian Carnival sweet.',
  'Porchetta di Nostra Produzione': 'House-made roast porchetta, scented with rosemary, garlic and wild fennel, slow-cooked until soft and flavorful.',
  'Scaloppine di Pollo al Marsala': 'Chicken breast slices pan-cooked and deglazed with Marsala, for a delicate, velvety sauce.',
  'Cioccolato Laica': 'Laica chocolate, a love of chocolate since 1946. Tradition, quality and craft from Arona.',
  'Pane di Semola Forte': 'Durum wheat semola bread with sourdough starter, Forte di Altamura brand. Crisp crust and soft, fragrant crumb.',
  'Taralli Danieli': 'Handmade Apulian taralli by Danieli, the bakery of Puglia from Bitonto. In Cacio e Pepe, Pizza and sweet Delizie variants.',
  'Lasagne Carne': 'Fresh pasta, ragù, béchamel, Grana',
  'Lasagne con Asparagi': 'Fresh pasta, béchamel, asparagus, onion, Grana',
  'Roast Beef': 'Beef, oil, salt and pepper',
  'Involtini Valdostani': 'Eggplant, cooked ham, cheese.',
  "Sciroppo per l'inverno": 'Italian honey, propolis, eucalyptus and mountain pine oil — the natural Alpine remedy.',
  'Tonno di Carloforte': 'Skipjack tuna in olive oil, caught and canned in Carloforte. Tonnare P.I.A.M.',
  'Babbi Dolcetorta al pistacchio': 'Pistachio wafer cake coated in milk chocolate — a specialty from Romagna tradition.',
  'Cioccolato Origine': 'Chocolate bars with no added sugar — milk, dark, with hazelnuts or pistachios.',
  'Prosciutto di Parma 24 Mesi': 'Prosciutto di Parma DOP aged 24 months — Battilani di Riazzi. Sweet, fragrant, knife-cut.',
  'Prosciutto di San Daniele Magnum': 'Prosciutto di San Daniele DOP Linea Extra Magnum — Carni Padane. Long-aged, sweet and delicate, knife-cut.',
  'Frutta in Acquavite Prunotto': 'Mariangela Prunotto fruit preserved in spirits, in two flavors: cherries in Moscato grappa spirits, and grapes in Moscato grappa spirits. Enjoy at the end of a meal or with cheeses and desserts.',
  'Riso Acquerello 8 Anni': 'Carnaroli rice aged 8 years — Acquerello. Whole grain, rich in flavor, ideal for risotto.',
  'Pinzimonio di Verdure Brezzo': 'Mixed fresh vegetables prepared sweet-and-sour — Brezzo. Enjoy as an appetizer or side dish.',
  'Specialità di Grano': 'Artisanal wheat puccia, focaccia and snacks — rosemary and pizza Cerchi di Grano, Le Figlie, Saltimbocca and crunchy Fili di Grano.',
  'Tiramisù della casa': 'Whipped mascarpone, ladyfingers soaked in coffee, bitter cocoa on top — made in house.',
  'Zuppa Inglese': 'Layers of pastry cream and chocolate with sponge cake soaked in Alchermes — a traditional spoon dessert.',
  'Porcini Tagliati Testa Nera': 'Sliced black-cap porcini mushrooms, steam-cooked without vinegar — in extra virgin olive oil. Brezzo, Italy.',
  'Crema Zabaione con Marsala': 'Artisanal zabaione cream with Marsala — gluten-free. Panzini, pastry makers since 1979.',
  'Aceto Balsamico IGP Campari': 'Balsamic Vinegar of Modena IGP — Lodovico Campari selection, in an elegant black case.',
  'Aceto Balsamico Oro Gold': 'Aged Balsamic Vinegar of Modena IGP — Fattoria Estense, Oro Gold reserve 250ml.',
  'Confettura Extra Mistilli': 'Artisanal extra jams by Mistilli, slow-cooked with only fruit and cane sugar.',
  'Albicocche in Grappa Brezzo': "Whole fruit preserved in syrup with grappa — Brezzo's 'Le Grappolose' line.",
  'Distillati Of Bonollo 1908': 'The Of line by Bonollo 1908: Of Dorange with orange, Grappa Of Amarone Barrique and Amaro Of. After-dinner spirits in collectible bottles.',
  'Fusilli di Pisa Martelli': 'Bronze-drawn Fusilli di Pisa — Martelli, a family of pasta makers since 1926. Durum wheat semolina, slow drying.',
  'Ragù di Cervo Regi': 'Homemade venison ragù — Regi, a South Tyrolean specialty. Ready sauce, ideal with pasta and polenta.',
  'Grissini Il Panificio': 'Artisanal breadsticks by Il Panificio — Gran Rustico mixed grain and toasted Cereali Scuri lines, with sourdough starter.',
  'Prosecco Astoria & Fongaro': 'Sparkling wine gift set — Carafa Prosecco DOC Treviso Astoria and Valdobbiadene Brut Fongaro, classic method.',
  'Ciambelline Bergamini': 'Whole-grain Ferrarese ciambelline — Panificio Bergamini since 1981. Traditional bread-biscuit, no added preservatives.',
  'Vini Assortiti': 'A selection of assorted wines — Valpolicella, Chianti Classico and Bardolino reds, Müller Thurgau, Soave and Traminer whites, and a Pinot Rosa sparkling wine.',
  'Melanzane "Pizzaiola"': 'Eggplant, flour, eggs, bread, oil, tomato, mozzarella',
  'Verdure Ripiene': 'Zucchini, eggplant, peppers, ricotta, Grana, eggs, bread',
  'Faraona Arrosto': 'Guinea fowl, garlic, rosemary, sage, oil',
  'Spezzatino di Tacchino': 'Turkey, fresh spices, oil, lemon — gluten-free',
  'Fagioli in "Potacin"': 'Beans, garlic, oil, tomato, cured ham, rosemary',
  "Pesto d'Agrumi": 'Basil, Grana, orange zest, cherry tomatoes',
  'Riso Venere': 'Venere black rice, asparagus, shrimp, oil',
  'Coniglio in Salmì': 'Rabbit, red wine, rosemary, sage, bay leaf, onion',
  'Polpettone di Vitello': 'Veal, bread, milk, eggs, ginger, olive oil, white wine',
  'Tacchino Farcito': 'Turkey, ham, olives, sage, pine nuts',
  'Arrosto di Vitello al Forno': 'Veal, olive oil, rosemary, sage',
  'Brasato al Vino': 'Beef, red wine, onion, carrot, celery, bay leaf',
  'Pollo con Patate': 'Chicken, potatoes, rosemary, garlic, white wine, oil',
  'Gnocchi alla Romana': 'Semolina, milk, butter, Grana, eggs',
  'Gnocchi alla Sorrentina': 'Potato gnocchi, tomato, mozzarella, basil',
  'Pasticciata': 'Baked pasta with peas and cooked ham, béchamel and Grana au gratin',
  'Stoccafisso': 'Stockfish, extra virgin olive oil, garlic, parsley — Venetian-style creamed',
  'Fondi di Carciofi': 'Artichoke hearts, extra virgin olive oil',
  'Puré di Patate': 'Potatoes, milk, butter, Grana',
  'Patate al Rosmarino al Forno': 'Potatoes, rosemary, garlic, extra virgin olive oil, salt',
  'Salmone agli Agrumi': 'Salmon, citrus, pink pepper, dill, extra virgin olive oil',
  'Capesante': 'Scallops, shrimp, garlic, parsley, oil — gratinéed',
  'Bistecca di Tonno': 'Tuna, sage, peppercorns, extra virgin olive oil',
  'Piselli': 'Peas, onion, extra virgin olive oil, broth — pan-cooked',
  'Spinaci': 'Fresh spinach sautéed in a pan with extra virgin olive oil and garlic.',
  'Prodotti Tipici Rovigo': 'A selection of local specialties: red wines, Arborio rice, tomato sauces and other regional excellences.',
  'Selezione Champagne e Spumanti': 'A selection of champagne and sparkling wines from top houses: Ferrari, Veuve Clicquot, Moët & Chandon, Laurent-Perrier and Richard Cheurlin.',
  'Bellavista Alma Grande Cuvée Brut': 'Franciacorta DOCG Bellavista Alma Grande Cuvée Brut. Elegant, persistent bubbles — perfect for a special toast.',
  'Fegato alla Veneziana': 'Veal liver, onions, oil, parsley, white wine',
  'Polpettone di Carni Bianche e Verdure': 'White meats, carrots, zucchini, Grana, eggs, breadcrumbs',
  'Merluzzo in Tempura': 'Cod, tempura batter, oil — crispy fried',
  'Seppie con Piselli': 'Cuttlefish, peas, tomato, onion, parsley',
  'Branzino': 'Baked sea bass fillets, extra virgin olive oil, salt, pepper',
  'Cotolette di Pollo': 'Breaded, fried chicken cutlets, crispy',
  'Platessa': 'Breaded plaice fillet, crispy — to bake or pan-fry',
  'Ricciola': 'Baked amberjack fillet with lemon, rosemary and extra virgin olive oil. A noble fish with firm, delicate flesh.',
  'Gallinella con Pomodorini e Olive': 'Pan-cooked gurnard fillets with cherry tomatoes, taggiasca olives, garlic and parsley. A classic Adriatic fish main.',
  'Sugo di Pesce': 'Seafood sauce with mussels, clams and shelled seafood, flavored with tomato, garlic and parsley. Ideal for spaghetti.',
  'Peperonata': 'Peppers, eggplant and onion slowly stewed with tomato and extra virgin olive oil. A sweet, flavorful summer side.',
  'Sarde in Saor': 'Fried sardines marinated with onions stewed in vinegar, raisins and pine nuts. A historic sweet-and-sour Venetian dish, best served the next day.',
  'Lenticchie': 'Lentils, onion, carrot, celery, extra virgin olive oil',
  'Polpette di Verdure': 'Eggplant and mozzarella, tomato, zucchini, radicchio and speck, peas and carrots, arugula and chicken, Grana',
  'Fagioli con Cipolla': 'Borlotti beans, white onion, extra virgin olive oil, vinegar',
  'Fagioli al Prezzemolo': 'White beans, garlic, parsley, extra virgin olive oil',
  'Insalata di Orzo': 'Pearl barley, eggplant, zucchini, cherry tomatoes, extra virgin olive oil',
  'Crostata di Albicocca': 'Shortcrust pastry, apricot jam, hazelnuts',
  'Crostata ai Frutti di Bosco': 'Shortcrust pastry, mixed berry jam, hazelnuts',
  'Frittelle': 'Venetian fritters with raisins and custard, dusted with icing sugar — a Carnival sweet.',
  'Crostoli': 'Thin, crispy fried pastry sheets, dusted with icing sugar — a Carnival sweet.',
  'Ciambella alla Ricotta': 'Soft baked ring cake made with fresh ricotta, scented with lemon and topped with sugar crystals. A simple, genuine breakfast treat.',
  'Selezione di Formaggi': "A wide selection of cheeses available at the counter — fresh, aged and hard, for every taste and occasion. Ask us what's available today.",
  "Foglie d'Ulivo agli Spinaci": 'Durum wheat semolina pasta with spinach, shaped like olive leaves, by Specialità Salvagno. Ideal with light extra-virgin olive oil dressings.',
  'Torronfetta Barbero': 'Crumbly D. Barbero nougat in thin slices, available with almonds or pistachios. Crisp and delicate, perfect with coffee.',
  'Marmellata di Limoni di Sicilia': 'Sicilian lemon marmalade by Fiasconaro, with an intense citrus aroma. Excellent on toast or for filling cakes.',
  'Confettura di Mirtilli Brezzo': 'Brezzo "La Sciroppata" blueberry jam, handmade with fresh fruit. Ideal on tarts, cheeses and wholesome breakfasts.',
  "Miele all'Arancio Brezzo": 'Italian Brezzo honey flavored with orange, in a jar with a wooden dipper. Delicate and fragrant, perfect for tea and infusions.',
  'Confetture Albicocca e Pesca Lazzaris': 'Lazzaris apricot and peach jams, sweetened only with grape sugar. Selected fruit with a natural, genuine taste.',
  'Gianduiotto Fondente Barbero': 'Dark gianduiotti by D. Barbero of Asti, in a collectible vintage tin. Fine chocolate with Piedmont hazelnuts.',
  'Olio Extra Vergine di Oliva Biologico Salvagno': 'Organic extra virgin olive oil by Frantoio Salvagno, cold-pressed. Fruity and balanced, ideal used raw.',
  'Crema di Pistacchio': 'Pistachio pesto by Peccatucci di Mamma Andrea, from Palermo: sweet-savory flavor, perfect on bruschetta, pasta or cheese.',
  'Crema Dolce al Pistacchio': 'Sweet pistachio spread by Peccatucci di Mamma Andrea, from Palermo: enjoy on bread, desserts or by the spoonful.',
  'Torrone Assortimento': 'An assortment of artisanal torroncini in six flavors — almond, pistachio, dark chocolate and candied fruit — a delicious holiday gift.',
  'Panettone Tradizionale': 'Artisanal Fiasconaro panettone, naturally leavened. Available in a variety of flavors depending on what\'s in stock — ask us about the current selection.',
  'Colomba Classica': 'Artisanal Fiasconaro colomba with candied orange and almond glaze. Available in a variety of flavors depending on what\'s in stock — ask us about the current selection.'
};
const DISH_VARIANTS = {};
const MENU_SECTIONS = [{
  id: 'antipasti',
  title: 'Antipasti & Contorni',
  titleEn: 'Starters & Sides',
  titleVec: 'Roba par Scominsiar & Contorni',
  subtitle: 'Vitello tonnato, verdure e insalate',
  subtitleEn: 'Vitello tonnato, vegetables and salads',
  dishes: ['Vitello Tonnato', 'Pomodori Ripieni', 'Insalata Russa', 'Melanzane "Pizzaiola"', 'Verdure Ripiene', 'Fagioli in "Potacin"', 'Cipolle al Forno', 'Peperonata', 'Zucca al Forno', "Fagiolini con l'Occhio e Acciughine", 'Verza con Pancetta', 'Puré di Patate', 'Patate al Rosmarino al Forno', 'Piselli', 'Spinaci', 'Lenticchie', 'Polpette di Verdure', 'Fagioli con Cipolla', 'Fagioli al Prezzemolo', 'Insalata di Orzo']
}, {
  id: 'primi',
  title: 'Primi Piatti',
  titleEn: 'First Courses',
  titleVec: 'Primi Piati',
  subtitle: 'Paste, riso e farro',
  subtitleEn: 'Pasta, rice and farro',
  dishes: ['Pasta Radicchio & Salsiccia', 'Pasta Fredda', 'Pasta Italia', 'Sugo di Pesce', 'Insalata di Riso', 'Insalata di Farro', 'Farro Vegano', 'Lasagne Carne', 'Lasagne con Asparagi', 'Orecchiette', 'Pasta Pomodorini Cacio e Pepe', "Pesto d'Agrumi", 'Riso Venere', 'Gnocchi alla Romana', 'Gnocchi alla Sorrentina', 'Pasticciata', 'Gnocchi di Zucca', 'Canederli con Speck']
}, {
  id: 'secondi',
  title: 'Secondi Piatti',
  titleEn: 'Main Courses',
  titleVec: 'Secondi Piati',
  subtitle: 'Specialità di carne e pesce',
  subtitleEn: 'Meat and fish specialties',
  dishes: ['Roast Beef', 'Spiedi di Gamberone', 'Involtini Valdostani', 'Spezzatino di Tacchino', 'Coniglio in Salmì', 'Polpettone di Vitello', 'Tacchino Farcito', 'Arrosto di Vitello al Forno', 'Brasato al Vino', 'Pollo con Patate', 'Stoccafisso', 'Salmone agli Agrumi', 'Capesante', 'Insalata di Mare', 'Sarde in Saor', 'Pollo alla Piastra', 'Trippa alla Parmigiana', 'Involtini di Tacchino', 'Baccalà alla Vicentina', 'Porchetta di Nostra Produzione', 'Scaloppine di Pollo al Marsala', 'Bistecca di Tonno', 'Fegato alla Veneziana', 'Polpettone di Carni Bianche e Verdure', 'Merluzzo in Tempura', 'Seppie con Piselli', 'Branzino', 'Ricciola', 'Gallinella con Pomodorini e Olive', 'Cotolette di Pollo', 'Platessa']
}, {
  id: 'dolci',
  title: 'Dolci',
  titleEn: 'Desserts',
  titleVec: 'Dolsi',
  subtitle: 'Della casa e della tradizione',
  subtitleEn: 'House-made and traditional',
  dishes: ['Tiramisù della casa', 'Zuppa Inglese', 'Crostata di Albicocca', 'Crostata ai Frutti di Bosco', 'Frittelle', 'Crostoli', 'Cappelletti Mostarda', 'Ciambella alla Ricotta']
}, {
  id: 'prodotti',
  title: 'Prodotti',
  titleEn: 'Products',
  titleVec: 'Roba Bòna',
  subtitle: 'Selezioni di stagione e promozioni',
  subtitleEn: 'Seasonal selections and specials',
  dishes: ['Selezione di Formaggi', 'Prodotti Tipici Rovigo', "Foglie d'Ulivo agli Spinaci", 'Olio Extra Vergine di Oliva Biologico Salvagno', 'Torronfetta Barbero', 'Gianduiotto Fondente Barbero', 'Confettura di Mirtilli Brezzo', "Miele all'Arancio Brezzo", 'Albicocche in Grappa Brezzo', 'Distillati Of Bonollo 1908', 'Porcini Tagliati Testa Nera', 'Marmellata di Limoni di Sicilia', 'Confetture Albicocca e Pesca Lazzaris', 'Cioccolato Laica', 'Pane di Semola Forte', 'Taralli Danieli', 'Confettura Extra Mistilli', 'Crema Zabaione con Marsala', 'Aceto Balsamico IGP Campari', 'Aceto Balsamico Oro Gold', "Sciroppo per l'inverno", 'Tonno di Carloforte', 'Babbi Dolcetorta al pistacchio', 'Cioccolato Origine', 'Prosciutto di Parma 24 Mesi', 'Prosciutto di San Daniele Magnum', 'Frutta in Acquavite Prunotto', 'Riso Acquerello 8 Anni', 'Fusilli di Pisa Martelli', 'Ragù di Cervo Regi', 'Grissini Il Panificio', 'Prosecco Astoria & Fongaro', 'Ciambelline Bergamini', 'Vini Assortiti', 'Specialità di Grano', 'Selezione Champagne e Spumanti', 'Bellavista Alma Grande Cuvée Brut', 'Crema di Pistacchio', 'Crema Dolce al Pistacchio', 'Torrone Assortimento', 'Panettone Tradizionale', 'Colomba Classica']
}];
function MenuSection() {
  const [selected, setSelected] = useState(null);
  const vp = useViewport();
  const lang = useLang().lang;
  const [activeSectionId, setActiveSectionId] = useState(MENU_SECTIONS[0] ? MENU_SECTIONS[0].id : null);
  const [showTop, setShowTop] = useState(false);
  const sectionRefs = React.useRef({});
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveSectionId(entry.target.dataset.sectionId);
      });
    }, {
      rootMargin: '-35% 0px -55% 0px',
      threshold: 0
    });
    Object.values(sectionRefs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);
  const cols = vp.isPhone ? 2 : vp.isMobile ? 3 : vp.isTablet ? 4 : 5;
  const gap = vp.isPhone ? 14 : vp.isMobile ? 20 : 32;
  const dishByName = React.useMemo(() => {
    const m = {};
    MENU_DISHES.forEach(d => {
      m[d.name] = d;
    });
    return m;
  }, []);
  const [autoSeasonKey, setAutoSeasonKey] = useState(() => getSeasonForDate(new Date()));
  useEffect(() => {
    const check = () => setAutoSeasonKey(getSeasonForDate(new Date()));
    const id = setInterval(check, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, []);
  const curSeasonKey = autoSeasonKey;
  const curSeason = SEASONS[curSeasonKey];
  const inSeasonDishes = React.useMemo(() => {
    return MENU_DISHES.filter(d => d.season === curSeasonKey);
  }, [curSeasonKey]);
  const visitSeed = React.useMemo(() => getVisitSeed(), []);
  const featuredSeasonDishes = React.useMemo(() => pickRotating(inSeasonDishes, 4, visitSeed), [inSeasonDishes, visitSeed]);
  return React.createElement("section", {
    style: {
      padding: vp.isMobile ? '48px 18px' : '72px 40px',
      maxWidth: 1200,
      margin: '0 auto'
    }
  }, React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: vp.isMobile ? 36 : 56
    }
  }, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 10 : 11,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: '#C8251D',
      marginBottom: 10
    }
  }, lang === 'vec' ? 'Par tute le ocasión' : lang === 'en' ? 'For every occasion' : 'Per tutte le occasioni'), React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: vp.isPhone ? 26 : vp.isMobile ? 30 : 38,
      fontWeight: 700,
      color: '#1A1108',
      letterSpacing: '-0.01em'
    }
  }, lang === 'vec' ? 'I Nostri Piati' : lang === 'en' ? 'Our Dishes' : 'I Nostri Piatti'), React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: vp.isMobile ? 14 : 16,
      color: '#6B4C33',
      marginTop: 10
    }
  }, lang === 'vec' ? 'Toca un piato par védar la ricéta' : lang === 'en' ? 'Tap a dish to reveal the recipe' : 'Tocca un piatto per scoprire la ricetta'), React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 12.5 : 13.5,
      color: '#8A7A63',
      marginTop: 12,
      maxWidth: 560,
      marginLeft: 'auto',
      marginRight: 'auto',
      lineHeight: 1.6
    }
  }, lang === 'vec' ? "El menù el xe tuto quel che savémo far: ma cosa che ghe xe pronto el varia de dì in dì, secondo la stagión e cosa che ghe pias al cogo quela matina — se rivè tardi, magari el xe za finìo!" : lang === 'en' ? "The menu represents our full range: availability of individual ready-made dishes may vary day to day, according to season and ingredient freshness." : "Il menù rappresenta l'intera nostra proposta: la disponibilità dei singoli piatti pronti può variare di giorno in giorno, secondo stagione e freschezza degli ingredienti.")), React.createElement("div", {
    style: {
      position: 'sticky',
      top: vp.isMobile ? 60 : 72,
      zIndex: 40,
      background: 'rgba(253,250,244,0.96)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid rgba(26,17,8,0.08)',
      margin: vp.isMobile ? '0 -18px 32px' : '0 -40px 48px',
      padding: vp.isMobile ? '10px 18px' : '12px 40px',
      display: 'flex',
      gap: 8,
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch'
    }
  }, MENU_SECTIONS.map(section => React.createElement("a", {
    key: section.id,
    href: `#section-${section.id}`,
    onClick: e => {
      e.preventDefault();
      document.getElementById(`section-${section.id}`)?.scrollIntoView({
        behavior: 'smooth'
      });
    },
    style: {
      flex: '0 0 auto',
      fontFamily: 'var(--font-body)',
      fontSize: 12.5,
      fontWeight: 600,
      letterSpacing: '0.02em',
      padding: '7px 14px',
      borderRadius: 999,
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      color: activeSectionId === section.id ? '#FDFAF4' : '#3D2B1A',
      background: activeSectionId === section.id ? '#C8251D' : 'rgba(26,17,8,0.06)',
      transition: 'all 0.25s ease'
    }
  }, lang === 'en' ? section.titleEn : lang === 'vec' ? section.titleVec || section.title : section.title))), React.createElement("div", {
    style: {
      background: `linear-gradient(135deg, ${curSeason.color}, ${curSeason.color}CC)`,
      borderRadius: 18,
      padding: vp.isMobile ? '24px 18px' : '32px 40px',
      marginBottom: vp.isMobile ? 40 : 60,
      color: '#FDFAF4'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 14,
      marginBottom: 18
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      opacity: 0.85
    }
  }, lang === 'en' ? 'In season now' : lang === 'vec' ? 'Qualcosa in stagion adesso' : 'Alcuni in stagione adesso'), React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: vp.isMobile ? 20 : 26,
      fontWeight: 700,
      margin: '4px 0 0',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      gap: 10
    }
  }, React.createElement("span", null, lang === 'vec' ? `Qualche Savor ${curSeasonKey === 'estate' || curSeasonKey === 'inverno' ? 'par i' : 'de'} ${curSeason.shortVec}` : lang === 'en' ? `Some Flavors ${curSeasonKey === 'estate' || curSeasonKey === 'inverno' ? 'for the' : 'of'} ${curSeason.labelEn}` : `Alcuni Sapori ${curSeasonKey === 'estate' || curSeasonKey === 'inverno' ? 'per i' : 'di'} ${curSeason.label}`), curSeasonKey === 'carnevale' && React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 12 : 14,
      fontWeight: 600,
      opacity: 0.85
    }
  }, getUpcomingCarnevaleRangeLabel(new Date(), lang)), (curSeasonKey === 'estate' || curSeasonKey === 'inverno') && React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 12 : 14,
      fontWeight: 600,
      opacity: 0.85
    }
  }, getUpcomingDstRangeLabel(curSeasonKey, new Date(), lang)), curSeasonKey === 'feste' && React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 12 : 14,
      fontWeight: 600,
      opacity: 0.85
    }
  }, getUpcomingFesteRangeLabel(new Date(), lang)), curSeasonKey === 'pasqua' && React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 12 : 14,
      fontWeight: 600,
      opacity: 0.85
    }
  }, getUpcomingPasquaRangeLabel(new Date(), lang))))), featuredSeasonDishes.length ? React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap,
      justifyItems: 'center',
      marginLeft: vp.isMobile ? -18 : -40,
      marginRight: vp.isMobile ? -18 : -40,
      paddingLeft: 14,
      paddingRight: 14
    }
  }, featuredSeasonDishes.map(d => React.createElement("div", {
    key: d.name,
    style: {
      width: '100%',
      textAlign: 'center'
    }
  }, React.createElement("div", {
    style: {
      width: '100%',
      aspectRatio: '1/1',
      borderRadius: '50%',
      overflow: 'hidden',
      border: '3px solid #FDFAF4',
      boxShadow: '0 6px 16px rgba(26,17,8,0.25)'
    }
  }, React.createElement("img", {
    src: d.src,
    alt: d.name,
    loading: "lazy",
    decoding: "async",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: DISH_POSITIONS[d.name] || 'center center'
    }
  })), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: vp.isMobile ? 11 : 12,
      fontWeight: 600,
      marginTop: 8,
      lineHeight: 1.25
    }
  }, lang === 'en' ? DISH_NAME_EN[d.name] || d.name : lang === 'vec' ? DISH_NAME_VEC[d.name] || d.name : d.name)))) : React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 13,
      opacity: 0.9
    }
  }, lang === 'vec' ? "Deso a brilar xe i nostri clàsici de tuto l'ano." : lang === 'en' ? 'Right now our year-round classics take center stage.' : "In questo periodo brillano i nostri classici di tutto l'anno.")), MENU_SECTIONS.map((section, sIdx) => {
    const END_SEASON_ORDER = {
      carnevale: 1,
      feste: 2,
      pasqua: 3
    };
    const curDstSeason = getHoursSeasonForDate(new Date());
    const sectionDishes = section.dishes.map(name => dishByName[name]).filter(Boolean).map((d, i) => ({
      d,
      i
    })).sort((a, b) => {
      const ra = a.d.season === curDstSeason ? -1 : END_SEASON_ORDER[a.d.season] || 0;
      const rb = b.d.season === curDstSeason ? -1 : END_SEASON_ORDER[b.d.season] || 0;
      if (ra !== rb) return ra - rb;
      return a.i - b.i;
    }).map(x => x.d);
    return React.createElement(MenuSectionReveal, {
      key: section.id,
      sectionId: section.id,
      sectionRefs: sectionRefs,
      style: {
        marginBottom: vp.isMobile ? 48 : 72
      }
    }, React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: vp.isMobile ? 14 : 20,
        marginBottom: vp.isMobile ? 22 : 32
      }
    }, React.createElement("div", {
      style: {
        flex: '0 0 auto',
        display: 'flex',
        alignItems: 'baseline',
        gap: 12
      }
    }, React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontSize: vp.isMobile ? 18 : 22,
        color: curSeason.color,
        fontWeight: 700,
        letterSpacing: '0.04em'
      }
    }, String(sIdx + 1).padStart(2, '0')), React.createElement("h3", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: vp.isPhone ? 22 : vp.isMobile ? 26 : 32,
        fontWeight: 700,
        color: '#1A1108',
        letterSpacing: '-0.01em',
        margin: 0
      }
    }, lang === 'en' ? section.titleEn : lang === 'vec' ? section.titleVec || section.title : section.title)), React.createElement("div", {
      style: {
        flex: 1,
        height: 1,
        background: 'linear-gradient(to right, rgba(26,17,8,0.18), rgba(26,17,8,0))'
      }
    }), section.subtitle && React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontSize: vp.isMobile ? 12 : 14,
        color: '#6B4C33',
        whiteSpace: 'nowrap',
        display: vp.isPhone ? 'none' : 'block'
      }
    }, section.subtitle && (lang === 'en' ? section.subtitleEn : lang === 'vec' ? DISH_SUBTITLE_VEC[section.id] || section.subtitle : section.subtitle))), sectionDishes.length === 0 ? React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontSize: vp.isMobile ? 13 : 14,
        color: '#9A8466',
        textAlign: 'center',
        padding: vp.isMobile ? '28px 12px' : '40px 16px',
        border: '1px dashed rgba(107,76,51,0.32)',
        borderRadius: 14,
        background: 'rgba(26,17,8,0.02)'
      }
    }, section.id === 'prodotti' ? lang === 'en' ? 'No products on special right now — come back and see us.' : "Nessun prodotto in promozione al momento — torna a trovarci." : lang === 'en' ? 'Coming soon.' : "In arrivo presto.") : React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap,
        justifyItems: 'center',
        alignItems: 'start'
      }
    }, sectionDishes.map(dish => {
      const isSel = selected && selected.sectionId === section.id && selected.name === dish.name;
      const desc = lang === 'en' ? DISH_DESCRIPTIONS_EN[dish.name] || DISH_DESCRIPTIONS[dish.name] || 'Description coming soon.' : lang === 'vec' ? DISH_DESCRIPTIONS_VEC[dish.name] || DISH_DESCRIPTIONS[dish.name] || 'Descrizion in rivo.' : DISH_DESCRIPTIONS[dish.name] || 'Descrizione in arrivo.';
      const displayName = lang === 'en' ? DISH_NAME_EN[dish.name] || dish.name : lang === 'vec' ? DISH_NAME_VEC[dish.name] || dish.name : dish.name;
      const variants = DISH_VARIANTS[dish.name];
      const isActiveSeasonal = !!dish.season && dish.season === curSeasonKey && FESTIVE_SEASONS.indexOf(curSeasonKey) !== -1;
      const seasonHi = isActiveSeasonal ? SEASONS[curSeasonKey].color : null;
      return React.createElement("figure", {
        key: section.id + ':' + dish.name,
        role: "button",
        tabIndex: 0,
        "aria-expanded": isSel,
        onClick: () => setSelected(isSel ? null : {
          sectionId: section.id,
          name: dish.name
        }),
        onKeyDown: e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelected(isSel ? null : {
              sectionId: section.id,
              name: dish.name
            });
          }
        },
        style: {
          margin: 0,
          width: '100%',
          textAlign: 'center',
          cursor: 'pointer',
          outline: 'none'
        }
      }, React.createElement("div", {
        style: {
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          borderRadius: '50%',
          overflow: 'visible',
          boxShadow: isActiveSeasonal ? `0 0 0 5px ${seasonRgba(seasonHi, 0.18)}, 0 14px 30px ${seasonRgba(seasonHi, 0.30)}` : isSel ? '0 14px 32px rgba(200,37,29,0.28)' : '0 6px 18px rgba(26,17,8,0.18)',
          border: isActiveSeasonal ? `4px solid ${seasonHi}` : isSel ? '4px solid var(--dish-accent, #C8251D)' : `${vp.isMobile ? 3 : 4}px solid #FDFAF4`,
          outline: '1px solid rgba(26,17,8,0.08)',
          transform: isSel ? 'translateY(-6px) scale(1.05)' : 'translateY(0) scale(1)',
          transition: 'transform 0.4s cubic-bezier(.2,.7,.2,1), box-shadow 0.35s ease, border-color 0.35s ease'
        }
      }, isActiveSeasonal && React.createElement("span", {
        style: {
          position: 'absolute',
          inset: -9,
          borderRadius: '50%',
          border: `2px solid ${seasonRgba(seasonHi, 0.45)}`,
          animation: 'carnevale-pulse 2s ease-out infinite',
          pointerEvents: 'none',
          zIndex: 1
        }
      }), dish.season && React.createElement("span", {
        style: {
          position: 'absolute',
          top: -6,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          fontFamily: 'var(--font-body)',
          fontSize: vp.isMobile ? 9 : 10,
          fontWeight: 700,
          letterSpacing: '0.06em',
          color: '#FDFAF4',
          background: SEASONS[dish.season].color,
          padding: vp.isMobile ? '3px 8px' : '4px 10px',
          borderRadius: 999,
          boxShadow: '0 3px 8px rgba(26,17,8,0.28)',
          whiteSpace: 'nowrap'
        }
      }, lang === 'en' ? SEASONS[dish.season].shortEn : lang === 'vec' ? SEASONS[dish.season].shortVec : SEASONS[dish.season].short), React.createElement("div", {
        style: {
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          background: '#FDFAF4'
        }
      }, React.createElement("img", {
        src: dish.src,
        alt: dish.name,
        loading: "lazy",
        decoding: "async",
        style: {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: DISH_POSITIONS[dish.name] || 'center center',
          display: 'block',
          transform: isSel ? 'scale(calc(var(--dish-zoom, 1) * 1.08))' : 'scale(var(--dish-zoom, 1))',
          transition: 'transform 0.6s cubic-bezier(.2,.7,.2,1)'
        }
      })), variants && React.createElement("div", {
        style: {
          position: 'absolute',
          bottom: -6,
          right: -6,
          background: 'var(--dish-accent, #C8251D)',
          color: '#FDFAF4',
          fontFamily: 'var(--font-body)',
          fontSize: vp.isMobile ? 9 : 10,
          fontWeight: 700,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          padding: vp.isMobile ? '4px 8px' : '5px 10px',
          borderRadius: 999,
          boxShadow: '0 3px 10px rgba(26,17,8,0.28)',
          border: '2px solid #FDFAF4',
          whiteSpace: 'nowrap'
        }
      }, "+", variants.length, " ", lang === 'en' ? 'flavors' : 'gusti')), React.createElement("figcaption", {
        style: {
          fontFamily: 'var(--font-display)',
          fontSize: vp.isPhone ? 12 : vp.isMobile ? 13 : 16,
          fontWeight: 600,
          color: isSel ? '#C8251D' : isActiveSeasonal ? seasonHi : '#1A1108',
          marginTop: vp.isMobile ? 10 : 14,
          letterSpacing: '0.01em',
          lineHeight: 1.25,
          transition: 'color 0.3s ease'
        }
      }, displayName), React.createElement("div", {
        style: {
          overflow: 'hidden',
          maxHeight: isSel ? 320 : 0,
          opacity: isSel ? 1 : 0,
          transform: isSel ? 'translateY(0)' : 'translateY(-4px)',
          transition: 'max-height 0.45s cubic-bezier(.2,.7,.2,1), opacity 0.35s ease 0.05s, transform 0.4s ease',
          marginTop: isSel ? 8 : 0
        }
      }, React.createElement("div", {
        style: {
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: vp.isMobile ? 12 : 13,
          lineHeight: 1.5,
          color: '#6B4C33',
          padding: '0 4px'
        }
      }, desc), variants && React.createElement("div", {
        style: {
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          justifyContent: 'center',
          marginTop: 10,
          padding: '0 4px'
        }
      }, variants.map(v => React.createElement("span", {
        key: v,
        style: {
          fontFamily: 'var(--font-body)',
          fontSize: vp.isMobile ? 10 : 11,
          color: '#6B4C33',
          background: 'rgba(200,37,29,0.08)',
          border: '1px solid rgba(200,37,29,0.22)',
          padding: '3px 9px',
          borderRadius: 999,
          letterSpacing: '0.02em'
        }
      }, v)))));
    })));
  }), React.createElement("button", {
    onClick: () => window.scrollTo({
      top: 0,
      behavior: 'smooth'
    }),
    "aria-label": "Torna in cima",
    style: {
      position: 'fixed',
      right: vp.isMobile ? 14 : 20,
      bottom: vp.isMobile ? 14 : 20,
      zIndex: 200,
      width: 44,
      height: 44,
      borderRadius: '50%',
      background: '#1A1108',
      color: '#FDFAF4',
      border: 'none',
      boxShadow: '0 4px 16px rgba(26,17,8,0.30)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: showTop ? 1 : 0,
      pointerEvents: showTop ? 'auto' : 'none',
      transition: 'opacity 0.3s ease'
    }
  }, React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, React.createElement("path", {
    d: "M12 19V5M5 12l7-7 7 7"
  }))));
}
const MUSIC_CREDITS = [{
  title: "Inno d'Italia",
  detail: 'U.S. Navy Band',
  license: 'pubblico dominio'
}];
function Footer({
  onNavigate
}) {
  const vp = useViewport();
  const lang = useLang().lang;
  const navLabels = lang === 'vec' ? {
    home: 'Casa',
    menu: 'El Menù',
    ricette: 'Ricéte',
    about: 'Chi Sémo',
    contact: 'Contàti'
  } : lang === 'en' ? {
    home: 'Home',
    menu: 'Menu',
    ricette: 'Recipes',
    about: 'About Us',
    contact: 'Contact'
  } : {
    home: 'Home',
    menu: 'Il Menù',
    ricette: 'Ricette',
    about: 'Chi Siamo',
    contact: 'Contatti'
  };
  return React.createElement("footer", {
    style: {
      background: '#1A1108',
      color: '#E8DCC8',
      padding: vp.isMobile ? '40px 20px 24px' : '56px 40px 32px'
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto'
    }
  }, React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: vp.isMobile ? '1fr' : '1.5fr 1fr 1fr',
      gap: vp.isMobile ? 28 : 48,
      marginBottom: vp.isMobile ? 28 : 48
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16
    }
  }, React.createElement("img", {
    src: window.IMGS.logo,
    alt: "F.lli Piva",
    loading: "lazy",
    decoding: "async",
    style: {
      width: 48,
      height: 48,
      borderRadius: '50%',
      objectFit: 'cover',
      opacity: 0.92
    }
  }), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 18,
      color: '#FDFAF4'
    }
  }, "F.lli Piva"), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 11,
      color: '#C9A97A'
    }
  }, lang === 'vec' ? 'in cusina par voaltri' : lang === 'en' ? 'in the kitchen for you' : 'in cucina per voi'))), React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: '#C9A97A',
      lineHeight: 1.7,
      maxWidth: 320
    }
  }, lang === 'vec' ? "Dal 1960 al servizio dei bongustai de Rovigo e dintorni. Salumeria, gastronomia e 'na sielta de vini de qualità." : lang === 'en' ? 'Serving the food lovers of Rovigo and the surrounding area since 1960. Delicatessen, prepared foods and a selection of quality wines.' : 'Dal 1960 al servizio dei buongustai di Rovigo e dintorni. Salumeria, gastronomia e una selezione di vini di qualità.')), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#D4A640',
      marginBottom: 16
    }
  }, lang === 'vec' ? 'Navigazion' : lang === 'en' ? 'Navigation' : 'Navigazione'), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, Object.entries(navLabels).map(([id, label]) => React.createElement("button", {
    key: id,
    onClick: () => onNavigate(id),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: '#C9A97A',
      padding: 0,
      transition: 'color 0.2s'
    },
    onMouseEnter: e => e.currentTarget.style.color = '#FDFAF4',
    onMouseLeave: e => e.currentTarget.style.color = '#C9A97A'
  }, label)))), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#D4A640',
      marginBottom: 16
    }
  }, lang === 'vec' ? 'Ndo che sémo' : lang === 'en' ? 'Find Us' : 'Dove Siamo'), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: '#C9A97A',
      lineHeight: 2
    }
  }, React.createElement("div", null, "Piazza G. Garibaldi, 15"), React.createElement("div", null, "45100 Rovigo (RO)"), React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, lang === 'en' ? 'Tel. 0425 24845' : 'Tel. 0425 24845'), React.createElement("div", null, "Facebook: Gastronomia Fratelli PIVA"), React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, React.createElement("a", {
    href: "https://www.deltaradio.it/sezioni/285/diretta",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: '#D4A640',
      textDecoration: 'none',
      borderBottom: '1px solid rgba(212,166,64,0.35)'
    }
  }, lang === 'vec' ? 'Scoltémo Delta Radio' : lang === 'en' ? 'We listen to Delta Radio' : 'Ascoltiamo Delta Radio'))))), React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(232,220,200,0.12)',
      paddingTop: 24,
      display: 'flex',
      flexDirection: vp.isPhone ? 'column' : 'row',
      gap: vp.isPhone ? 8 : 0,
      justifyContent: 'space-between',
      alignItems: vp.isPhone ? 'flex-start' : 'center'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      color: '#6B4C33'
    }
  }, lang === 'en' ? '© F.lli Piva · Gastronomia since 1960 · Rovigo' : '© F.lli Piva · Gastronomia dal 1960 · Rovigo'), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 12,
      color: '#6B4C33'
    }
  }, lang === 'vec' ? 'in cusina par voaltri' : lang === 'en' ? 'in the kitchen for you' : 'in cucina per voi')), React.createElement("details", {
    style: {
      marginTop: 20
    }
  }, React.createElement("summary", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 10,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#6B4C33',
      cursor: 'pointer',
      textAlign: vp.isPhone ? 'left' : 'center'
    }
  }, lang === 'vec' ? 'Crediti de la musica' : lang === 'en' ? 'Music credits' : 'Crediti musicali'), React.createElement("div", {
    style: {
      marginTop: 14,
      display: 'grid',
      gap: 10,
      maxWidth: 760,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  }, MUSIC_CREDITS.map(c => React.createElement("div", {
    key: c.title,
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 10.5,
      color: '#6B4C33',
      lineHeight: 1.6
    }
  }, React.createElement("span", {
    style: {
      color: '#C9A97A'
    }
  }, c.title), c.detail ? ' — ' + c.detail : '', " · ", c.licenseUrl ? React.createElement("a", {
    href: c.licenseUrl,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: '#6B4C33'
    }
  }, c.license) : c.license)))), React.createElement("div", {
    style: {
      textAlign: vp.isPhone ? 'left' : 'center',
      marginTop: 18
    }
  }, React.createElement("a", {
    href: "mailto:djrdjr@live.com?subject=WEBSITE",
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 10,
      color: '#C9A97A',
      textDecoration: 'underline',
      textUnderlineOffset: 2
    }
  }, lang === 'vec' ? 'Sito fato da' : lang === 'en' ? 'Site by' : 'Sito a cura di', " Daniel John Rainey · djrdjr@live.com"))));
}
const RECIPES = [{
  id: 'farro-vegano',
  name: 'Farro Vegano',
  nameEn: "Vegan Farro Salad",
  season: 'estate',
  img: 'images/dishes/farro_vegano.jpg',
  tagline: 'Farro perlato saltato con verdure di stagione: leggero, colorato, tutto vegetale.',
  taglineEn: "Pearl farro sautéed with seasonal vegetables: light, colorful, all-vegetable.",
  ingredients: ['300g farro perlato', '1 carota', '1 peperone', '½ cipolla bianca', '100g piselli', 'Olio extravergine, sale'],
  ingredientsEn: ["300g pearl farro", "1 carrot", "1 bell pepper", "½ white onion", "100g peas", "Extra virgin olive oil, salt"],
  steps: ['Cuocere il farro in acqua salata, scolare e raffreddare.', 'Tagliare le verdure a dadini piccoli.', 'Saltare le verdure in padella con olio per 8 minuti.', 'Unire il farro e mantecare a fuoco vivo per un minuto.', 'Servire tiepido o freddo, con un filo d\'olio a crudo.'],
  stepsEn: ["Cook the farro in salted water, drain and cool.", "Cut the vegetables into small dice.", "Sauté the vegetables in oil for 8 minutes.", "Add the farro and toss over high heat for one minute.", "Serve warm or cold, with a drizzle of raw olive oil."]
}, {
  id: 'peperonata',
  name: 'Peperonata',
  nameEn: "Peperonata",
  season: 'estate',
  img: 'images/dishes/peperonata.jpg',
  tagline: 'Peperoni, cipolla e pomodoro stufati lentamente: un contorno estivo della tradizione.',
  taglineEn: "Peppers, onion and tomato slowly stewed: a traditional summer side dish.",
  ingredients: ['4 peperoni misti', '1 cipolla', '2 pomodori maturi', 'Olio extravergine, sale, basilico'],
  ingredientsEn: ["4 mixed bell peppers", "1 onion", "2 ripe tomatoes", "Extra virgin olive oil, salt, basil"],
  steps: ['Tagliare i peperoni a listarelle e la cipolla a fette sottili.', 'Stufare la cipolla in olio a fuoco dolce per 5 minuti.', 'Aggiungere i peperoni e i pomodori a pezzi.', 'Cuocere coperto a fuoco basso per 30 minuti, mescolando di tanto in tanto.', 'Profumare con basilico fresco e servire tiepida.'],
  stepsEn: ["Cut the peppers into strips and slice the onion thinly.", "Stew the onion in oil over low heat for 5 minutes.", "Add the peppers and chopped tomatoes.", "Cook covered over low heat for 30 minutes, stirring occasionally.", "Finish with fresh basil and serve warm."]
}, {
  id: 'gnocchi-di-zucca',
  name: 'Gnocchi di Zucca',
  nameEn: "Pumpkin Gnocchi",
  season: 'inverno',
  img: 'images/dishes/gnocchi_di_zucca.jpg',
  tagline: 'Gnocchi morbidi alla zucca, conditi con burro e salvia: il comfort food dell\'inverno.',
  taglineEn: "Soft pumpkin gnocchi, dressed with butter and sage: winter comfort food.",
  ingredients: ['500g zucca cotta al forno', '200g farina', '1 uovo', 'Burro e salvia per condire', 'Grana grattugiato'],
  ingredientsEn: ["500g baked pumpkin", "200g flour", "1 egg", "Butter and sage to finish", "Grated Grana"],
  steps: ['Schiacciare la zucca cotta fino a renderla una purea liscia.', 'Impastare con farina e uovo fino a ottenere un composto morbido.', 'Formare i gnocchi e infarinarli leggermente.', 'Cuocere in acqua bollente salata fino a quando vengono a galla.', 'Condire con burro fuso e salvia, spolverare di grana.'],
  stepsEn: ["Mash the cooked pumpkin into a smooth purée.", "Knead with flour and egg into a soft dough.", "Shape the gnocchi and dust lightly with flour.", "Cook in boiling salted water until they float.", "Toss with melted butter and sage, dust with Grana."]
}, {
  id: 'baccala-alla-vicentina',
  name: 'Baccalà alla Vicentina',
  nameEn: "Baccalà alla Vicentina",
  season: 'inverno',
  img: 'images/dishes/baccala_alla_vicentina.jpg',
  tagline: 'Baccalà stufato con latte, cipolla e acciughe: un classico veneto delle sere fredde.',
  taglineEn: "Salt cod stewed with milk, onion and anchovies: a Venetian classic for cold evenings.",
  ingredients: ['800g baccalà ammollato', '1 cipolla', '2 acciughe sotto sale', 'Latte q.b.', 'Olio extravergine, prezzemolo, grana'],
  ingredientsEn: ["800g soaked salt cod", "1 onion", "2 salted anchovies", "Milk, as needed", "Extra virgin olive oil, parsley, Grana"],
  steps: ['Rosolare la cipolla tritata con le acciughe in olio.', 'Aggiungere il baccalà tagliato a pezzi, senza mescolare troppo.', 'Coprire a filo con il latte e un filo d\'olio.', 'Cuocere a fuoco bassissimo per circa 2 ore, scuotendo la pentola di tanto in tanto.', 'Servire con polenta e prezzemolo fresco.'],
  stepsEn: ["Brown the chopped onion with the anchovies in oil.", "Add the cod cut into pieces, without stirring too much.", "Cover with milk and a drizzle of oil.", "Cook over very low heat for about 2 hours, shaking the pot occasionally.", "Serve with polenta and fresh parsley."]
}, {
  id: 'frittelle',
  name: 'Frittelle',
  nameEn: "Carnival Fritters",
  season: 'carnevale',
  img: 'images/dishes/frittelle.jpg',
  tagline: 'Le frittelle veneziane con uvetta e pinoli: il dolce simbolo del Carnevale.',
  taglineEn: "Venetian fritters with raisins and pine nuts: the sweet symbol of Carnival.",
  ingredients: ['300g farina', '2 uova', '30g zucchero', 'Uvetta e pinoli q.b.', 'Lievito, scorza di limone', 'Olio per friggere, zucchero a velo'],
  ingredientsEn: ["300g flour", "2 eggs", "30g sugar", "Raisins and pine nuts, as needed", "Yeast, lemon zest", "Oil for frying, icing sugar"],
  steps: ['Sciogliere il lievito in poco latte tiepido.', 'Impastare farina, uova, zucchero e scorza di limone con il latte.', 'Unire uvetta e pinoli, lasciare lievitare un\'ora.', 'Friggere a cucchiaiate in olio caldo fino a doratura.', 'Scolare, lasciare intiepidire e spolverare di zucchero a velo.'],
  stepsEn: ["Dissolve the yeast in a little warm milk.", "Knead flour, eggs, sugar and lemon zest with the milk.", "Add raisins and pine nuts, let rise for an hour.", "Fry spoonfuls in hot oil until golden.", "Drain, let cool slightly and dust with icing sugar."]
}, {
  id: 'crostoli',
  name: 'Crostoli',
  nameEn: "Crostoli",
  season: 'carnevale',
  img: 'images/dishes/crostoli.jpg',
  tagline: 'Sfoglie sottili fritte e spolverate di zucchero: croccanti come vuole la tradizione di Carnevale.',
  taglineEn: "Thin fried pastry sheets dusted with sugar: crisp, as Carnival tradition demands.",
  ingredients: ['300g farina', '2 uova', '30g burro', '30g zucchero', 'Un goccio di grappa', 'Olio per friggere, zucchero a velo'],
  ingredientsEn: ["300g flour", "2 eggs", "30g butter", "30g sugar", "A splash of grappa", "Oil for frying, icing sugar"],
  steps: ['Impastare farina, uova, burro, zucchero e grappa fino a ottenere un impasto liscio.', 'Lasciare riposare l\'impasto per 30 minuti.', 'Stendere la sfoglia sottile e tagliarla a losanghe.', 'Friggere in olio caldo fino a doratura, pochi pezzi alla volta.', 'Scolare su carta assorbente e spolverare di zucchero a velo.'],
  stepsEn: ["Knead flour, eggs, butter, sugar and grappa into a smooth dough.", "Let the dough rest for 30 minutes.", "Roll out thinly and cut into diamond shapes.", "Fry in hot oil until golden, a few pieces at a time.", "Drain on paper towel and dust with icing sugar."]
}, {
  id: 'polpette-di-verdure',
  name: 'Polpette di Verdure',
  nameEn: "Vegetable Meatballs",
  season: null,
  img: 'images/dishes/polpette_di_verdure.jpg',
  tagline: 'Polpette di verdure miste, grana e pangrattato: un classico gastronomico di tutto l\'anno.',
  taglineEn: "Mixed vegetable, Grana and breadcrumb patties: a year-round gastronomia classic.",
  ingredients: ['400g verdure miste cotte', '2 uova', '80g grana grattugiato', 'Pangrattato q.b.', 'Prezzemolo, sale, pepe'],
  ingredientsEn: ["400g cooked mixed vegetables", "2 eggs", "80g grated Grana", "Breadcrumbs, as needed", "Parsley, salt, pepper"],
  steps: ['Tritare finemente le verdure cotte e strizzarle bene.', 'Unire uova, grana, prezzemolo e un po\' di pangrattato.', 'Formare delle polpette con le mani, passarle nel pangrattato.', 'Cuocere in forno a 200°C per 20 minuti, girandole a metà cottura.', 'Servire calde o a temperatura ambiente.'],
  stepsEn: ["Finely chop the cooked vegetables and squeeze out excess liquid.", "Mix in eggs, Grana, parsley and a little breadcrumb.", "Shape into balls by hand, coat in breadcrumbs.", "Bake at 200°C (390°F) for 20 minutes, turning halfway through.", "Serve hot or at room temperature."]
}, {
  id: 'insalata-di-farro',
  name: 'Insalata di Farro',
  nameEn: "Farro Salad",
  season: null,
  img: 'images/dishes/insalata_di_farro.jpg',
  tagline: 'Farro, verdure croccanti e olio extravergine: un piatto fresco e completo tutto l\'anno.',
  taglineEn: "Farro, crunchy vegetables and extra virgin olive oil: a fresh, complete dish all year round.",
  ingredients: ['250g farro perlato', 'Pomodorini, carote, mais', 'Olive taggiasche', 'Olio extravergine, sale, origano'],
  ingredientsEn: ["250g pearl farro", "Cherry tomatoes, carrots, corn", "Taggiasca olives", "Extra virgin olive oil, salt, oregano"],
  steps: ['Cuocere il farro in acqua salata e scolare, raffreddare.', 'Tagliare le verdure a pezzetti piccoli.', 'Unire il farro alle verdure e alle olive.', 'Condire con olio, sale e origano.', 'Lasciare insaporire in frigo almeno un\'ora prima di servire.'],
  stepsEn: ["Cook the farro in salted water, drain and cool.", "Cut the vegetables into small pieces.", "Combine the farro with the vegetables and olives.", "Dress with oil, salt and oregano.", "Let it rest in the fridge for at least an hour before serving."]
}, {
  id: 'insalata-di-riso',
  name: 'Insalata di Riso',
  nameEn: "Rice Salad",
  season: 'estate',
  img: 'images/dishes/insalata_di_riso.jpg',
  tagline: 'Riso freddo con verdure croccanti e sottaceti: il classico da picnic delle tavole estive.',
  taglineEn: "Cold rice with crunchy vegetables and pickles: the classic picnic dish of summer tables.",
  ingredients: ['320g riso', 'Wurstel o prosciutto cotto a dadini', 'Carote, piselli, mais', 'Sottaceti misti', 'Olio extravergine, sale'],
  ingredientsEn: ["320g rice", "Diced wurstel or cooked ham", "Carrots, peas, corn", "Mixed pickled vegetables", "Extra virgin olive oil, salt"],
  steps: ['Cuocere il riso in acqua salata, scolare e raffreddare stendendolo su un vassoio.', 'Tagliare a dadini piccoli il prosciutto cotto e le verdure.', 'Unire tutti gli ingredienti al riso freddo.', 'Condire con olio extravergine e un pizzico di sale.', 'Lasciare riposare in frigo almeno un\'ora prima di servire.'],
  stepsEn: ["Cook the rice in salted water, drain and spread it on a tray to cool.", "Dice the cooked ham and vegetables finely.", "Combine all ingredients with the cooled rice.", "Dress with extra virgin olive oil and a pinch of salt.", "Let it rest in the fridge for at least an hour before serving."]
}, {
  id: 'riso-venere',
  name: 'Riso Venere',
  nameEn: "Venere Black Rice",
  season: 'estate',
  img: 'images/dishes/riso_venere.jpg',
  tagline: 'Riso nero integrale con asparagi e gamberetti, condito a crudo con olio extravergine: fresco ed elegante.',
  taglineEn: "Whole black rice with asparagus and shrimp, dressed raw with extra virgin olive oil: fresh and elegant.",
  ingredients: ['300g riso venere', '200g gamberetti sgusciati', 'Un mazzo di asparagi', 'Olio extravergine, sale'],
  ingredientsEn: ["300g Venere black rice", "200g shelled shrimp", "A bunch of asparagus", "Extra virgin olive oil, salt"],
  steps: ['Cuocere il riso venere in acqua salata per circa 40 minuti, scolare e raffreddare.', 'Sbollentare gli asparagi e tagliarli a tocchetti, tenendo le punte intere.', 'Saltare in padella i gamberetti con un filo d\'olio per pochi minuti.', 'Unire riso, asparagi e gamberetti in una ciotola.', 'Condire con olio extravergine e sale, servire freddo o a temperatura ambiente.'],
  stepsEn: ["Cook the Venere rice in salted water for about 40 minutes, drain and cool.", "Blanch the asparagus and cut into pieces, keeping the tips whole.", "Sauté the shrimp in a little oil for a few minutes.", "Combine rice, asparagus and shrimp in a bowl.", "Dress with extra virgin olive oil and salt, serve cold or at room temperature."]
}, {
  id: 'canederli-con-speck',
  name: 'Canederli con Speck',
  nameEn: "Speck Dumplings",
  season: 'inverno',
  img: 'images/dishes/canederli_con_speck.jpg',
  tagline: 'Canederli di pane raffermo e speck in brodo: un piatto caldo delle montagne per l\'inverno.',
  taglineEn: "Stale-bread and speck dumplings in broth: a warm mountain dish for winter.",
  ingredients: ['300g pane raffermo a dadini', '150g speck a dadini', '2 uova', 'Latte q.b.', 'Farina, erba cipollina', 'Brodo di carne o vegetale'],
  ingredientsEn: ["300g diced stale bread", "150g diced speck", "2 eggs", "Milk, as needed", "Flour, chives", "Meat or vegetable broth"],
  steps: ['Ammorbidire il pane con latte tiepido per 10 minuti.', 'Unire uova, speck a dadini, erba cipollina e un poco di farina.', 'Formare delle palle compatte con le mani.', 'Cuocere i canederli nel brodo bollente per 15-18 minuti.', 'Servire ben caldi nel loro brodo.'],
  stepsEn: ["Soften the bread with warm milk for 10 minutes.", "Add eggs, diced speck, chives and a little flour.", "Shape into firm balls by hand.", "Cook the dumplings in boiling broth for 15-18 minutes.", "Serve piping hot in their broth."]
}, {
  id: 'zucca-al-forno',
  name: 'Zucca al Forno',
  nameEn: "Roasted Pumpkin",
  season: 'inverno',
  img: 'images/dishes/zucca_al_forno.jpg',
  tagline: 'Fette di zucca arrostite con rosmarino: un contorno dolce e caldo per le sere fredde.',
  taglineEn: "Roasted pumpkin slices with rosemary: a sweet, warm side for cold evenings.",
  ingredients: ['1 zucca (circa 1kg)', 'Olio extravergine', 'Rosmarino fresco', 'Sale, pepe'],
  ingredientsEn: ["1 pumpkin (about 1kg)", "Extra virgin olive oil", "Fresh rosemary", "Salt, pepper"],
  steps: ['Tagliare la zucca a fette non troppo spese, eliminando la buccia.', 'Disporle su una teglia con carta forno.', 'Condire con olio, rosmarino tritato, sale e pepe.', 'Cuocere in forno a 200°C per 30-35 minuti, girando a metà cottura.', 'Servire calda come contorno.'],
  stepsEn: ["Slice the pumpkin not too thick, removing the skin.", "Arrange on a lined baking tray.", "Dress with oil, chopped rosemary, salt and pepper.", "Bake at 200°C (390°F) for 30-35 minutes, turning halfway through.", "Serve hot as a side."]
}, {
  id: 'faraona-arrosto',
  name: 'Faraona Arrosto',
  nameEn: "Roast Guinea Fowl",
  season: 'inverno',
  img: 'images/dishes/faraona_arrosto.jpg',
  tagline: 'Faraona intera arrostita con erbe aromatiche: il piatto della domenica d\'inverno.',
  taglineEn: "Whole roasted guinea fowl with aromatic herbs: the Sunday dish of winter.",
  ingredients: ['1 faraona intera', 'Rosmarino, salvia, aglio', 'Vino bianco', 'Olio extravergine, sale, pepe'],
  ingredientsEn: ["1 whole guinea fowl", "Rosemary, sage, garlic", "White wine", "Extra virgin olive oil, salt, pepper"],
  steps: ['Legare la faraona e massaggiarla con olio, sale e pepe.', 'Farcire l\'interno con rosmarino, salvia e aglio.', 'Rosolarla in una teglia da tutti i lati, poi sfumare con vino bianco.', 'Cuocere in forno a 180°C per circa 1 ora e 15 minuti, bagnandola con il fondo di cottura.', 'Lasciare riposare 10 minuti prima di tagliarla e servire.'],
  stepsEn: ["Truss the guinea fowl and rub with oil, salt and pepper.", "Stuff the inside with rosemary, sage and garlic.", "Brown it on all sides in a roasting pan, then deglaze with white wine.", "Roast at 180°C (355°F) for about 1 hour 15 minutes, basting with the pan juices.", "Rest for 10 minutes before carving and serving."]
}, {
  id: 'lenticchie',
  name: 'Lenticchie',
  nameEn: "Lentils",
  season: 'inverno',
  img: 'images/dishes/lenticchie.jpg',
  tagline: 'Lenticchie stufate con sedano, carota e cipolla: comfort food invernale, ottime con il cotechino.',
  taglineEn: "Lentils stewed with celery, carrot and onion: winter comfort food, great with cotechino.",
  ingredients: ['400g lenticchie', 'Sedano, carota, cipolla', 'Passata di pomodoro', 'Olio extravergine, alloro, sale'],
  ingredientsEn: ["400g lentils", "Celery, carrot, onion", "Tomato passata", "Extra virgin olive oil, bay leaf, salt"],
  steps: ['Preparare un soffritto con sedano, carota e cipolla tritati finemente.', 'Aggiungere le lenticchie e la passata di pomodoro.', 'Coprire con acqua o brodo e unire una foglia di alloro.', 'Cuocere a fuoco basso per circa 40 minuti, mescolando di tanto in tanto.', 'Salare a fine cottura e servire calde.'],
  stepsEn: ["Prepare a soffritto with finely chopped celery, carrot and onion.", "Add the lentils and tomato passata.", "Cover with water or broth and add a bay leaf.", "Cook over low heat for about 40 minutes, stirring occasionally.", "Season with salt at the end and serve hot."]
}];
const RECIPE_VEC = {
  'farro-vegano': {
    tagline: "Faro perlà saltà co' le verdure de stagión: lisiero, colorà, tuto vegetal.",
    ingredients: ['300g de faro perlà', '1 carota', '1 peperon', '½ zegola bianca', '100g de bisi', 'Ojo bon, sal'],
    steps: ['Còsar el faro in acqua salà, colar e far frédar.', 'Tajar le verdure a dadini pìcoli.', 'Saltar le verdure in tècia co\' l\'ojo par 8 minuti.', 'Zontar el faro e mantecar a fógo vivo par un minuto.', 'Servir tiepido o fredo, co\' un fil de ojo a crudo.']
  },
  'peperonata': {
    tagline: "Peperoni, zegola e pomodoro stufài pian pian: un contorno de l\'istà de \'na volta.",
    ingredients: ['4 peperoni missi', '1 zegola', '2 pomodori maduri', 'Ojo bon, sal, basìlico'],
    steps: ['Tajar i peperoni a strisse e la zegola a fetine sotìe.', 'Stufar la zegola in te l\'ojo a fógo dolse par 5 minuti.', 'Zontar i peperoni e i pomodori a tocheti.', 'Còsar coverto a fógo basso par 30 minuti, missiando ogni tanto.', 'Profumar co\' basìlico fresco e servir tiepida.']
  },
  'gnocchi-di-zucca': {
    tagline: "Gnochi morbidi de suca, condìi co\' butiro e salvia: el comfort de l\'inverno.",
    ingredients: ['500g de suca còta al forno', '200g de farina', '1 vovo', 'Butiro e salvia par condir', 'Grana gratà'],
    steps: ['Sciaciar la suca còta fin che la vien \'na purea lissa.', 'Impastar co\' farina e vovo fin che vien un composto morbido.', 'Far i gnochi e infarinarli un fià.', 'Còsarli in acqua bojente salà fin che i vien a gala.', 'Condir co\' butiro fondù e salvia, spolverar de Grana.']
  },
  'baccala-alla-vicentina': {
    tagline: "Bacalà stufà co\' late, zegola e asciughe: un classico veneto de le sere frede.",
    ingredients: ['800g de bacalà mòjo', '1 zegola', '2 asciughe soto sal', 'Late quel che basta', 'Ojo bon, persémolo, Grana'],
    steps: ['Rosolar la zegola trità co\' le asciughe in te l\'ojo.', 'Zontar el bacalà tajà a tocheti, sensa missiar masa.', 'Coverzar a fil co\' el late e un fil de ojo.', 'Còsar a fógo bassìssimo par un par de ore, scorlàndo la tècia ogni tanto.', 'Servir co\' la polenta e persémolo fresco.']
  },
  'frittelle': {
    tagline: "Le fritole venessiane co\' ua passa e pinoli: el dolse che vol dir Carneval.",
    ingredients: ['300g de farina', '2 vovi', '30g de zùcaro', 'Ua passa e pinoli quel che basta', 'Levà, scorsa de limon', 'Ojo par frìzar, zùcaro a vélo'],
    steps: ['Desfar el levà in tun fià de late tiepido.', 'Impastar farina, vovi, zùcaro e scorsa de limon co\' el late.', 'Zontar ua passa e pinoli, lassar levar un\'ora.', 'Frìzar a cuciaràe in te l\'ojo caldo fin che vien dorà.', 'Colar, lassar tiepidir e spolverar de zùcaro a vélo.']
  },
  'crostoli': {
    tagline: "Sfoje sotìe frità e spolverà de zùcaro: crocante come vol la tradizion de Carneval.",
    ingredients: ['300g de farina', '2 vovi', '30g de butiro', '30g de zùcaro', 'Un got de grapa', 'Ojo par frìzar, zùcaro a vélo'],
    steps: ['Impastar farina, vovi, butiro, zùcaro e grapa fin che vien un impasto lisso.', 'Lassar riposar l\'impasto par 30 minuti.', 'Tirar la sfoja sotìa e tajarla a losanghe.', 'Frìzar in te l\'ojo caldo fin che vien dorà, pochi tocheti a la volta.', 'Colar su la carta e spolverar de zùcaro a vélo.']
  },
  'polpette-di-verdure': {
    tagline: "Polpéte de verdure misse, Grana e pan gratà: un classico de la gastronomia de tut l\'ano.",
    ingredients: ['400g de verdure misse còte', '2 vovi', '80g de Grana gratà', 'Pan gratà quel che basta', 'Persémolo, sal, pévare'],
    steps: ['Trinciar fin le verdure còte e strucarle ben.', 'Zontar vovi, Grana, persémolo e un fià de pan gratà.', 'Far le polpéte co\' le man, passarle in tel pan gratà.', 'Còsar in forno a 200°C par 20 minuti, voltàndole a metà.', 'Servir calde o a temperatura de stansa.']
  },
  'insalata-di-farro': {
    tagline: "Faro, verdure crocante e ojo bon: un piat fresco e completo de tut l\'ano.",
    ingredients: ['250g de faro perlà', 'Pomarini, carote, mais', 'Olive taggiasche', 'Ojo bon, sal, orìgano'],
    steps: ['Còsar el faro in acqua salà, colar e far frédar.', 'Tajar le verdure a tocheti pìcoli.', 'Zontar el faro a le verdure e a le olive.', 'Condir co\' ojo, sal e orìgano.', 'Lassar insaorir in frigo almanco un\'ora prima de servir.']
  },
  'insalata-di-riso': {
    tagline: "Riso fredo co\' verdure crocante e sotaseti: el classico da pic-nic de le tòle de l\'istà.",
    ingredients: ['320g de riso', 'Wurstel o prosciuto còto a dadini', 'Carote, bisi, mais', 'Sotaseti missi', 'Ojo bon, sal'],
    steps: ['Còsar el riso in acqua salà, colar e far frédar spandéndolo su un vasoio.', 'Tajar a dadini pìcoli el prosciuto còto e le verdure.', 'Zontar tuto al riso fredo.', 'Condir co\' ojo bon e un pìsego de sal.', 'Lassar riposar in frigo almanco un\'ora prima de servir.']
  },
  'riso-venere': {
    tagline: "Riso nero integral co\' sparasi e gamberéti, condìo a crudo co\' l\'ojo bon: fresco e elegante.",
    ingredients: ['300g de riso venere', '200g de gamberéti sgusài', 'Un masso de sparasi', 'Ojo bon, sal'],
    steps: ['Còsar el riso venere in acqua salà par circa 40 minuti, colar e far frédar.', 'Sbojentar i sparasi e tajarli a tocheti, tegnéndo le punte intiere.', 'Saltar in tècia i gamberéti co\' un fil de ojo par pochi minuti.', 'Zontar riso, sparasi e gamberéti in tuna scudèla.', 'Condir co\' ojo bon e sal, servir fredo o a temperatura de stansa.']
  },
  'canederli-con-speck': {
    tagline: "Canederli de pan seco e speck in brodo: un piat caldo de le montagne par l\'inverno.",
    ingredients: ['300g de pan seco a dadini', '150g de speck a dadini', '2 vovi', 'Late quel che basta', 'Farina, erba sivolina', 'Brodo de carne o de verdura'],
    steps: ['Molar el pan co\' late tiepido par 10 minuti.', 'Zontar vovi, speck a dadini, erba sivolina e un fià de farina.', 'Far dei balòti compati co\' le man.', 'Còsar i canederli in tel brodo bojente par 15-18 minuti.', 'Servir ben caldi in tel so brodo.']
  },
  'zucca-al-forno': {
    tagline: "Fete de suca rostìe co\' rosmarin: un contorno dolse e caldo par le sere frede.",
    ingredients: ['1 suca (circa 1kg)', 'Ojo bon', 'Rosmarin fresco', 'Sal, pévare'],
    steps: ['Tajar la suca a fete no masa grosse, cavàndo via la scorsa.', 'Métarle su \'na tècia co\' la carta forno.', 'Condir co\' ojo, rosmarin trità, sal e pévare.', 'Còsar in forno a 200°C par 30-35 minuti, voltàndo a metà.', 'Servir calda come contorno.']
  },
  'faraona-arrosto': {
    tagline: "Faraona intiera rostìa co\' le erbe: el piat de la doménega d\'inverno.",
    ingredients: ['1 faraona intiera', 'Rosmarin, salvia, ajo', 'Vin bianco', 'Ojo bon, sal, pévare'],
    steps: ['Ligar la faraona e massajarla co\' ojo, sal e pévare.', 'Impinir drento co\' rosmarin, salvia e ajo.', 'Rosolarla in tuna tècia da tute le bande, po\' sfumar co\' vin bianco.', 'Còsar in forno a 180°C par circa un\'ora e un quarto, bagnàndola col so fondo.', 'Lassar riposar 10 minuti prima de tajarla e servir.']
  },
  'lenticchie': {
    tagline: "Lentìce stufà co\' selino, carota e zegola: comfort de l\'inverno, bòne col cotechin.",
    ingredients: ['400g de lentìce', 'Selino, carota, zegola', 'Passata de pomodoro', 'Ojo bon, alloro, sal'],
    steps: ['Far un soffrito co\' selino, carota e zegola trinciài fin.', 'Zontar le lentìce e la passata de pomodoro.', 'Coverzar co\' acqua o brodo e zontar \'na foja de alloro.', 'Còsar a fógo basso par circa 40 minuti, missiando ogni tanto.', 'Salar a fin còtura e servir calde.']
  }
};
function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return {
    week: Math.ceil(((d - yearStart) / 86400000 + 1) / 7),
    year: d.getUTCFullYear()
  };
}
function getRecipeOfTheWeek(date) {
  const seasonKey = getSeasonForDate(date);
  const pool = RECIPES.filter(r => r.season === null || r.season === seasonKey);
  if (pool.length === 0) return RECIPES[0];
  const {
    week,
    year
  } = getISOWeek(date);
  return pool[(year * 53 + week) % pool.length];
}
function RecipePage() {
  const vp = useViewport();
  const lang = useLang().lang;
  const recipe = React.useMemo(() => getRecipeOfTheWeek(new Date()), []);
  const seasonInfo = recipe.season ? SEASONS[recipe.season] : null;
  return React.createElement("section", {
    style: {
      maxWidth: 900,
      margin: '0 auto',
      padding: vp.isMobile ? '32px 18px 60px' : '56px 40px 90px'
    }
  }, React.createElement("div", {
    style: {
      borderRadius: 14,
      overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(26,17,8,0.14)',
      background: '#F5F0E6'
    }
  }, React.createElement("div", {
    style: {
      position: 'relative',
      height: vp.isMobile ? 220 : 360
    }
  }, React.createElement("img", {
    src: recipe.img,
    alt: lang === 'en' ? recipe.nameEn : recipe.name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to top, rgba(26,17,8,0.75), transparent 60%)'
    }
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      left: vp.isMobile ? 20 : 40,
      bottom: vp.isMobile ? 16 : 28,
      color: '#FDFAF4'
    }
  }, seasonInfo && React.createElement("span", {
    style: {
      display: 'inline-block',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: '#fff',
      background: seasonInfo.color,
      padding: '4px 12px',
      borderRadius: 999
    }
  }, lang === 'en' ? seasonInfo.labelEn : lang === 'vec' ? SEASON_LABEL_VEC[recipe.season] || seasonInfo.label : seasonInfo.label), React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: vp.isMobile ? 26 : 40,
      margin: '10px 0 0'
    }
  }, lang === 'en' ? recipe.nameEn : lang === 'vec' ? DISH_NAME_VEC[recipe.name] || recipe.name : recipe.name))), React.createElement("div", {
    style: {
      padding: vp.isMobile ? '24px 20px' : '36px 44px'
    }
  }, React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: '#C8251D'
    }
  }, lang === 'vec' ? 'Ricéta de la stimana' : lang === 'en' ? 'Recipe of the Week' : 'Ricetta della settimana'), React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 17,
      color: '#6B4C33',
      margin: '10px 0 30px'
    }
  }, lang === 'en' ? recipe.taglineEn : lang === 'vec' ? (RECIPE_VEC[recipe.id] || {}).tagline || recipe.tagline : recipe.tagline), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: vp.isMobile ? '1fr' : '1fr 1.4fr',
      gap: vp.isMobile ? 28 : 40
    }
  }, React.createElement("div", null, React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 18,
      margin: '0 0 14px',
      color: '#1A1108'
    }
  }, lang === 'vec' ? 'Ingredienti' : lang === 'en' ? 'Ingredients' : 'Ingredienti'), React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: 18,
      lineHeight: 2,
      fontSize: 14,
      color: '#3D2B1A'
    }
  }, (lang === 'en' ? recipe.ingredientsEn : lang === 'vec' ? (RECIPE_VEC[recipe.id] || {}).ingredients || recipe.ingredients : recipe.ingredients).map((ing, i) => React.createElement("li", {
    key: i
  }, ing)))), React.createElement("div", null, React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 18,
      margin: '0 0 14px',
      color: '#1A1108'
    }
  }, lang === 'vec' ? 'Come se fa' : lang === 'en' ? 'Method' : 'Procedimento'), React.createElement("ol", {
    style: {
      margin: 0,
      paddingLeft: 18,
      lineHeight: 1.9,
      fontSize: 14,
      color: '#3D2B1A'
    }
  }, (lang === 'en' ? recipe.stepsEn : lang === 'vec' ? (RECIPE_VEC[recipe.id] || {}).steps || recipe.steps : recipe.steps).map((s, i) => React.createElement("li", {
    key: i
  }, s))))))));
}
function AboutPage() {
  const vp = useViewport();
  const lang = useLang().lang;
  const en = lang === 'en';
  return React.createElement("div", {
    style: {
      maxWidth: 960,
      margin: '0 auto',
      padding: vp.isMobile ? '48px 20px' : '80px 40px'
    }
  }, React.createElement(ScrollReveal, null, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 10 : 11,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: '#C8251D',
      marginBottom: 12
    }
  }, lang === 'vec' ? 'La storia nostra' : en ? 'Our Story' : 'La nostra storia'), React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: vp.isPhone ? 30 : vp.isMobile ? 36 : 46,
      fontWeight: 700,
      color: '#1A1108',
      letterSpacing: '-0.02em',
      marginBottom: vp.isMobile ? 24 : 32,
      lineHeight: 1.15
    }
  }, lang === 'vec' ? "Dal 1960 co' i stesi paróni" : en ? 'Since 1960, under the same family' : 'Dal 1960 con gli stessi proprietari')), React.createElement(ScrollReveal, {
    style: {
      display: 'grid',
      gridTemplateColumns: vp.isMobile ? '1fr' : '1fr 1fr',
      gap: vp.isMobile ? 28 : 40,
      alignItems: 'start',
      marginBottom: vp.isMobile ? 40 : 56
    }
  }, React.createElement("div", null, React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 14 : 15,
      color: '#3D2B1A',
      lineHeight: 1.85,
      marginBottom: 16
    }
  }, lang === 'vec' ? "El botegón dei Piva el xe nato come botéga de tradizion polesana, in t'un palaso che za del 1600-1700 el gaveva drento comerci compagni. Tirà a nòvo da cao a piè nel 1990, el negosio el gà savesto tegner l'ària vera de 'na volta." : en ? 'The Piva grocery shop was born as a store rooted in Polesine tradition, in a building that already housed similar commercial activities back in the 1600s–1700s. Fully renovated in 1990, the shop has preserved the authentic character that has always defined it.' : 'Il negozio di generi alimentari Piva nasce come bottega di tradizione polesana, in un palazzo che dal 1600–1700 ospitava già attività commerciali affini. Completamente rinnovato e ristrutturato nel 1990, il negozio ha saputo conservare il carattere autentico che lo ha sempre contraddistinto.'), React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 14 : 15,
      color: '#3D2B1A',
      lineHeight: 1.85,
      marginBottom: 16
    }
  }, lang === 'vec' ? React.createElement(React.Fragment, null, "I fondatori — i fradèi ", React.createElement("strong", null, "Walter e Nazareno Piva"), " — in pi de trent'ani i gà tirà su 'na roba de gran qualità, passàndo la passión par la roba genuina e i riguardi par la gente.") : en ? React.createElement(React.Fragment, null, "The founders — brothers ", React.createElement("strong", null, "Walter and Nazareno Piva"), " — built a business of great quality over more than 30 years, passing on their passion for genuine products and care for customers.") : React.createElement(React.Fragment, null, "I fondatori — i fratelli ", React.createElement("strong", null, "Piva, Walter e Nazareno"), " — hanno costruito in oltre 30 anni una realtà di grande qualità, trasmettendo la passione per i prodotti genuini e la cura verso la clientela.")), React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 14 : 15,
      color: '#3D2B1A',
      lineHeight: 1.85
    }
  }, lang === 'vec' ? React.createElement(React.Fragment, null, "Incuò i Fradèi Piva i tien in man ogni roba de persona: da la salumeria a la gastronomia fata ogni dì, dai vini e formai fin ai pachéti regalo e le ceste de Nadal. ", React.createElement("em", null, "Granda profesionalità e tanta cortesia"), ", sempre.") : en ? React.createElement(React.Fragment, null, "Today Fratelli Piva runs every aspect directly: from the delicatessen to the prepared foods made fresh each day, from the selection of wines and cheeses to gift packages and holiday baskets. ", React.createElement("em", null, "Great professionalism and kindness"), ", always.") : React.createElement(React.Fragment, null, "Oggi Fratelli Piva gestisce direttamente ogni aspetto: dalla salumeria alla gastronomia preparata ogni giorno, dalla selezione di vini e formaggi alle confezioni regalo e ceste natalizie. ", React.createElement("em", null, "Grande professionalità e gentilezza"), ", sempre."))), React.createElement("div", null, React.createElement("img", {
    src: window.IMGS.storefront,
    alt: "Gastronomia F.lli Piva — Piazza Garibaldi, Rovigo",
    loading: "lazy",
    decoding: "async",
    style: {
      width: '100%',
      height: vp.isMobile ? 220 : 300,
      objectFit: 'cover',
      borderRadius: 14,
      boxShadow: '0 4px 20px rgba(26,17,8,0.14)',
      display: 'block'
    }
  }), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontStyle: 'italic',
      fontSize: 11,
      color: '#6B4C33',
      marginTop: 8,
      textAlign: 'center'
    }
  }, "Piazza G. Garibaldi, 15 · Rovigo"))), React.createElement(ScrollReveal, null, React.createElement("blockquote", {
    style: {
      borderLeft: '4px solid #C8251D',
      background: '#FDFAF4',
      padding: vp.isMobile ? '20px 22px' : '24px 28px',
      borderRadius: '0 12px 12px 0',
      boxShadow: '0 2px 8px rgba(26,17,8,0.07)',
      marginBottom: vp.isMobile ? 40 : 56
    }
  }, React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: vp.isMobile ? 17 : 21,
      color: '#1A1108',
      lineHeight: 1.5,
      marginBottom: 10
    }
  }, en ? '"A paradise for food lovers — great professionalism and kindness, with the care of those who love their work."' : '"Paradiso dei buongustai — grande professionalità e gentilezza, con la cura di chi ama il proprio lavoro."'), React.createElement("cite", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: '#6B4C33',
      letterSpacing: '0.06em'
    }
  }, en ? '— Il Gazzettino, September 28, 1999' : '— Il Gazzettino, 28 settembre 1999'))), React.createElement(ScrollReveal, {
    style: {
      marginBottom: vp.isMobile ? 40 : 56,
      textAlign: 'center'
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#C8251D',
      marginBottom: 10
    }
  }, lang === 'vec' ? 'I ne gà meso in television!' : en ? 'On television' : 'In televisione'), React.createElement("video", {
    controls: true,
    playsInline: true,
    preload: "none",
    poster: "images/brand/rai1_poster.jpg",
    style: {
      width: '100%',
      maxWidth: 800,
      height: 'auto',
      display: 'block',
      margin: '0 auto',
      borderRadius: 10,
      boxShadow: '0 4px 20px rgba(26,17,8,0.16)',
      background: '#1A1108'
    }
  }, React.createElement("source", {
    src: "videos/rai1.mp4",
    type: "video/mp4"
  })), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontStyle: 'italic',
      fontSize: 11,
      color: '#6B4C33',
      marginTop: 8
    }
  }, lang === 'vec' ? "La volta che Rai 1 la xe vegnùa a catarne in botéga — Linea Verde Life" : en ? 'The Rai 1 visit to the gastronomia — Linea Verde Life' : 'La visita da Rai 1 alla gastronomia — Linea Verde Life'))), React.createElement(ScrollReveal, {
    style: {
      display: 'grid',
      gridTemplateColumns: vp.isMobile ? '1fr' : '1.2fr 1fr',
      gap: vp.isMobile ? 28 : 32,
      alignItems: 'start',
      marginBottom: vp.isMobile ? 40 : 56
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#C8251D',
      marginBottom: 10
    }
  }, lang === 'vec' ? 'Come che i giornai i gà contà de nualtri' : en ? 'As the press told it' : 'Come ci ha raccontato la stampa'), React.createElement("img", {
    src: window.IMGS.gazzettino,
    alt: "Il Gazzettino 1999 — Fratelli Piva",
    loading: "lazy",
    decoding: "async",
    style: {
      width: '100%',
      borderRadius: 10,
      boxShadow: '0 4px 20px rgba(26,17,8,0.16)',
      display: 'block'
    }
  }), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontStyle: 'italic',
      fontSize: 11,
      color: '#6B4C33',
      marginTop: 8
    }
  }, en ? 'Il Gazzettino · September 28, 1999 · "Fratelli Piva: showcasing the quality of times past"' : 'Il Gazzettino · 28 settembre 1999 · "Fratelli Piva: in primo piano la qualità del tempo antico"')), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#C8251D',
      marginBottom: 10
    }
  }, lang === 'vec' ? 'La Nostra Squadra' : en ? 'Our Team' : 'Il nostro team'), React.createElement("img", {
    src: window.IMGS.team,
    alt: "Il team di F.lli Piva",
    loading: "lazy",
    decoding: "async",
    style: {
      width: '100%',
      height: 'auto',
      aspectRatio: '894 / 662',
      objectFit: 'contain',
      background: '#F5F0E6',
      borderRadius: 10,
      boxShadow: '0 4px 20px rgba(26,17,8,0.14)',
      display: 'block',
      marginBottom: 16
    }
  }), React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: '#3D2B1A',
      lineHeight: 1.8
    }
  }, lang === 'vec' ? "El nostro personal el se dà da far ogni benedéto dì par darghe a la bòna clientela roba de prima, fata co' ingredienti freschi sielti tute le matine bonora." : en ? 'Our staff works every day with dedication to offer our valued customers top-quality products, prepared with fresh ingredients selected every morning.' : 'Il nostro staff lavora ogni giorno con dedizione per offrire alla gentile clientela prodotti di prima qualità, preparati con ingredienti freschi selezionati ogni mattina.'))), React.createElement(ScrollReveal, null, React.createElement("div", {
    style: {
      background: '#FDFAF4',
      borderRadius: 16,
      padding: vp.isMobile ? '24px 22px' : '32px 36px',
      boxShadow: '0 2px 12px rgba(26,17,8,0.08)',
      display: 'grid',
      gridTemplateColumns: vp.isMobile ? '1fr' : '1fr 1.1fr',
      gap: vp.isMobile ? 24 : 32,
      alignItems: 'center'
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#C8251D',
      marginBottom: 12
    }
  }, lang === 'vec' ? 'El Nostro Menù' : en ? 'Our Menu' : 'Il nostro menù'), React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: vp.isMobile ? 22 : 26,
      fontWeight: 700,
      color: '#1A1108',
      marginBottom: 14
    }
  }, lang === 'vec' ? 'Sempre freschi' : en ? 'Always fresh, always home-made' : 'Sempre freschi'), React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: '#3D2B1A',
      lineHeight: 1.85,
      marginBottom: 20
    }
  }, lang === 'vec' ? 'Antipasti, primi, secondi, pese, contorni e dolci — fati freschi ogni santo dì.' : en ? 'Starters, first courses, mains, fish, sides and desserts — prepared fresh every day.' : 'Antipasti, primi, secondi, pesce, contorni e dolci — preparati ogni giorno.'), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: '#6B4C33',
      fontStyle: 'italic'
    }
  }, en ? 'Tel. and fax 0425 24845' : 'Tel. e fax 0425 24845')), React.createElement("img", {
    src: window.IMGS.menuDoc,
    alt: "Menù Gastronomia F.lli Piva",
    loading: "lazy",
    decoding: "async",
    style: {
      width: '100%',
      borderRadius: 10,
      boxShadow: '0 4px 16px rgba(26,17,8,0.14)',
      display: 'block'
    }
  }))));
}
function HoursTester() {
  const vp = useViewport();
  const lang = useLang().lang;
  const en = lang === 'en';
  const today = new Date();
  const [day, setDay] = useState(today.getDate());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const monthNames = lang === 'vec' ? MONTH_NAMES_VEC_CAP : en ? MONTH_NAMES_EN : ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  const daysInMonth = new Date(year, month, 0).getDate();
  const safeDay = Math.min(day, daysInMonth);
  const testDate = new Date(year, month - 1, safeDay);
  const info = getTodayHoursInfo(testDate);
  const dowLabel = lang === 'vec' ? DAY_NAMES_VEC[testDate.getDay()] : en ? DAY_NAMES_EN[testDate.getDay()] : DAY_NAMES_IT[testDate.getDay()];
  const seasonLabels = lang === 'vec' ? {
    estate: 'Istà',
    inverno: 'Inverno',
    december: 'Dicembre'
  } : en ? {
    estate: 'Warm',
    inverno: 'Cold',
    december: 'December'
  } : {
    estate: 'Estate',
    inverno: 'Inverno',
    december: 'Dicembre'
  };
  const seasonLabel = info.seasonKey === 'inverno' && isCarnevalePeriod(testDate) ? lang === 'vec' ? 'Carneval' : en ? 'Carnival' : 'Carnevale' : seasonLabels[info.seasonKey];
  let resultLabel, resultColor;
  if (info.closed) {
    const holidayLabel = info.holidayName ? lang === 'vec' ? HOLIDAY_NAME_VEC[info.holidayName] || info.holidayName : en ? HOLIDAY_NAME_EN[info.holidayName] || info.holidayName : info.holidayName : null;
    resultLabel = holidayLabel ? `${lang === 'vec' ? 'Serà' : en ? 'Closed' : 'Chiuso'} — ${holidayLabel}` : lang === 'vec' ? 'Serà' : en ? 'Closed' : 'Chiuso';
    resultColor = '#C8251D';
  } else if (info.entry) {
    resultLabel = info.entry.times.join(', ');
    resultColor = '#1A1108';
  } else {
    resultLabel = '—';
    resultColor = '#1A1108';
  }
  const selectStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    fontWeight: 600,
    color: '#1A1108',
    background: '#fff',
    border: '1.5px solid rgba(26,17,8,0.15)',
    borderRadius: 8,
    padding: '9px 10px',
    cursor: 'pointer'
  };
  return React.createElement("div", {
    style: {
      marginTop: vp.isMobile ? 20 : 28,
      background: '#FDFAF4',
      borderRadius: 16,
      padding: vp.isMobile ? '24px 22px' : '28px 32px',
      boxShadow: '0 2px 12px rgba(26,17,8,0.08)',
      border: '1px solid rgba(200,37,29,0.20)'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#C8251D',
      marginBottom: 10
    }
  }, lang === 'vec' ? 'Par i nostri clienti' : en ? 'For our customers' : 'Per i nostri clienti'), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: vp.isMobile ? 18 : 20,
      fontWeight: 600,
      color: '#1A1108',
      marginBottom: 8
    }
  }, lang === 'vec' ? "Varda se sémo verti in t'un dì che gà da vegner" : en ? 'Check if we are open on a future day' : 'Verifica se siamo aperti in un giorno futuro'), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13.5,
      color: '#6B4C33',
      marginBottom: 18,
      lineHeight: 1.5
    }
  }, lang === 'vec' ? "Sielzi 'na data par saver sùbito se la gastronomia la xe verta e a che ora, feste e cambio de stagión comprese." : en ? "Pick a date to instantly find out if the gastronomia is open and at what time, including holidays and seasonal changes." : 'Scegli una data per sapere subito se la gastronomia è aperta e a che ora, comprese festività e cambio di stagione.'), React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 18,
      alignItems: 'center'
    }
  }, React.createElement("select", {
    value: safeDay,
    onChange: e => setDay(Number(e.target.value)),
    style: selectStyle
  }, Array.from({
    length: daysInMonth
  }, (_, i) => i + 1).map(d => React.createElement("option", {
    key: d,
    value: d
  }, d))), React.createElement("select", {
    value: month,
    onChange: e => setMonth(Number(e.target.value)),
    style: selectStyle
  }, monthNames.map((m, i) => React.createElement("option", {
    key: m,
    value: i + 1
  }, m))), React.createElement("select", {
    value: year,
    onChange: e => setYear(Number(e.target.value)),
    style: selectStyle
  }, Array.from({
    length: 11
  }, (_, i) => 2024 + i).map(y => React.createElement("option", {
    key: y,
    value: y
  }, y)))), React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: vp.isMobile ? 20 : 40,
      alignItems: 'baseline'
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: '#8A7A63',
      marginBottom: 4
    }
  }, lang === 'vec' ? 'Dì' : en ? 'Day' : 'Giorno'), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 18,
      fontWeight: 600,
      color: '#1A1108'
    }
  }, dowLabel)), info.seasonKey && React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: '#8A7A63',
      marginBottom: 4
    }
  }, lang === 'vec' ? 'Stagión orario' : en ? 'Hours Season' : 'Stagione orario'), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 18,
      fontWeight: 600,
      color: '#1A1108'
    }
  }, seasonLabel)), React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: '#8A7A63',
      marginBottom: 4
    }
  }, lang === 'vec' ? 'Orario calcolà' : en ? 'Calculated Hours' : 'Orario calcolato'), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 18,
      fontWeight: 600,
      color: resultColor
    }
  }, resultLabel))));
}
function ContactPage() {
  const vp = useViewport();
  const lang = useLang().lang;
  const en = lang === 'en';
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [season, setSeason] = useState('standard');
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Gastronomia+Fratelli+Piva+Piazza+Garibaldi+15+Rovigo';
  const hoursStandard = HOURS_ESTATE;
  const hoursInverno = HOURS_INVERNO;
  const holidays = React.useMemo(() => getHolidaysList(new Date(), lang), [lang]);
  const isInverno = season === 'inverno';
  const isHolidays = season === 'holidays';
  const hours = isInverno ? hoursInverno : hoursStandard;
  const panelBg = '#1A1108';
  return React.createElement("div", {
    style: {
      maxWidth: 1000,
      margin: '0 auto',
      padding: vp.isMobile ? '48px 20px' : '80px 40px'
    }
  }, React.createElement(MountReveal, {
    index: 0
  }, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 10 : 11,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: '#C8251D',
      marginBottom: 12
    }
  }, lang === 'vec' ? 'Sémo qua par voaltri' : en ? 'We are here for you' : 'Siamo a tua disposizione'), React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: vp.isPhone ? 28 : vp.isMobile ? 32 : 40,
      fontWeight: 700,
      color: '#1A1108',
      marginBottom: 12,
      lineHeight: 1.15
    }
  }, lang === 'vec' ? 'Vien a catarne' : en ? 'Come Visit Us' : 'Vieni a trovarci'), React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: vp.isMobile ? 14 : 15,
      color: '#6B4C33',
      marginBottom: vp.isMobile ? 28 : 40,
      maxWidth: 600
    }
  }, lang === 'vec' ? "Par órdini, prenotazion e ceste regalo, ciàmane o fà un salto in botéga: sarémo contenti de darve el benvegnù de persona." : en ? 'For orders, reservations and gift baskets, call us or stop by the shop: we\'ll be happy to welcome you in person.' : 'Per ordini, prenotazioni e ceste regalo, chiamaci o passa in negozio: saremo felici di accoglierti di persona.')), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: vp.isMobile ? '1fr' : '1.05fr 1fr',
      gap: vp.isMobile ? 28 : 40,
      alignItems: 'start'
    }
  }, React.createElement(MountReveal, {
    index: 1,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: vp.isMobile ? 20 : 24
    }
  }, React.createElement("div", {
    style: {
      background: '#C8251D',
      color: '#FDFAF4',
      borderRadius: 16,
      padding: vp.isMobile ? '28px 24px' : '36px 32px',
      boxShadow: '0 8px 28px rgba(200,37,29,0.25)'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'rgba(253,250,244,0.78)',
      marginBottom: 12
    }
  }, lang === 'vec' ? 'Ciàmane' : en ? 'Call Us' : 'Chiamaci'), React.createElement("a", {
    href: "tel:+39042524845",
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: vp.isPhone ? 32 : vp.isMobile ? 38 : 44,
      fontWeight: 700,
      color: '#FDFAF4',
      letterSpacing: '-0.01em',
      textDecoration: 'none',
      display: 'inline-block',
      lineHeight: 1.1
    }
  }, "0425 24845"), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: vp.isMobile ? 13 : 14,
      color: 'rgba(253,250,244,0.85)',
      marginTop: 14,
      lineHeight: 1.55
    }
  }, lang === 'vec' ? "Par órdini e prenotazion, parlé drito co' nualtri: cusì podémo consejarve al mèjo e curar ogni piat come che va fato." : en ? "For orders and reservations, talk to us directly. It lets us advise you best and take care of every dish the way it should be." : 'Per ordini e prenotazioni, parlate direttamente con noi. Ci permette di consigliarvi al meglio e curare ogni piatto come si deve.')), React.createElement("div", {
    style: {
      background: '#FDFAF4',
      borderRadius: 16,
      padding: vp.isMobile ? '24px 22px' : '28px 28px',
      boxShadow: '0 2px 12px rgba(26,17,8,0.08)',
      border: '1px solid rgba(26,17,8,0.06)'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#C8251D',
      marginBottom: 10
    }
  }, lang === 'vec' ? 'Ndo che sémo' : en ? 'Find Us' : 'Dove siamo'), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: vp.isMobile ? 19 : 22,
      fontWeight: 600,
      color: '#1A1108',
      marginBottom: 4,
      letterSpacing: '-0.01em'
    }
  }, "Piazza Giuseppe Garibaldi, 15"), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: '#6B4C33',
      marginBottom: 18
    }
  }, "45100 Rovigo (RO) · ", en ? 'Italy' : 'Italia'), React.createElement("a", {
    href: mapsUrl,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'transparent',
      color: '#C8251D',
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      fontWeight: 600,
      padding: '9px 18px',
      borderRadius: 999,
      border: '1.5px solid #C8251D',
      cursor: 'pointer',
      letterSpacing: '0.04em',
      textDecoration: 'none',
      transition: 'background 0.2s ease'
    },
    onMouseEnter: e => e.currentTarget.style.background = '#F9EAEA',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, React.createElement("span", {
    style: {
      fontSize: 14
    }
  }, "📍"), lang === 'vec' ? 'Verzi su Google Maps' : en ? 'Open in Google Maps' : 'Apri in Google Maps')), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: '#6B4C33',
      lineHeight: 1.7,
      paddingTop: 4
    }
  }, React.createElement("span", {
    style: {
      fontWeight: 600,
      color: '#3D2B1A'
    }
  }, lang === 'vec' ? 'Seguìne su Facebook:' : en ? 'Follow us on Facebook:' : 'Seguici su Facebook:'), " Gastronomia Fratelli PIVA")), React.createElement(MountReveal, {
    index: 2,
    style: {}
  }, React.createElement("div", {
    id: "hours-panel",
    style: {
      background: panelBg,
      color: '#E8DCC8',
      borderRadius: 16,
      padding: vp.isMobile ? '28px 24px' : '36px 32px',
      boxShadow: '0 8px 24px rgba(26,17,8,0.20)',
      transition: 'background 0.3s ease',
      scrollMarginTop: 80
    }
  }, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: '#D4A640',
      marginBottom: 14
    }
  }, lang === 'vec' ? 'Orari de avertura' : en ? 'Opening Hours' : 'Orari di apertura'), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: vp.isMobile ? 22 : 26,
      fontWeight: 600,
      color: '#FDFAF4',
      marginBottom: 20,
      letterSpacing: '-0.01em'
    }
  }, lang === 'vec' ? 'Quando che sémo verti' : en ? 'When We\'re Open' : 'Quando siamo aperti'), React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 8,
      background: 'rgba(232,220,200,0.08)',
      padding: 4,
      borderRadius: 999
    }
  }, (lang === 'vec' ? [{
    id: 'standard',
    label: 'Istà'
  }, {
    id: 'inverno',
    label: 'Inverno'
  }, {
    id: 'holidays',
    label: 'Feste'
  }] : en ? [{
    id: 'standard',
    label: 'Summer'
  }, {
    id: 'inverno',
    label: 'Winter'
  }, {
    id: 'holidays',
    label: 'Holidays'
  }] : [{
    id: 'standard',
    label: 'Estate'
  }, {
    id: 'inverno',
    label: 'Inverno'
  }, {
    id: 'holidays',
    label: 'Festività'
  }]).map(({
    id,
    label
  }) => {
    const active = season === id;
    return React.createElement("button", {
      key: id,
      onClick: () => setSeason(id),
      style: {
        flex: '1 1 auto',
        minWidth: vp.isMobile ? 'calc(50% - 3px)' : 0,
        fontFamily: 'var(--font-body)',
        fontSize: vp.isMobile ? 11.5 : 12.5,
        fontWeight: 600,
        letterSpacing: '0.02em',
        padding: vp.isMobile ? '8px 6px' : '9px 10px',
        borderRadius: 999,
        border: 'none',
        cursor: 'pointer',
        color: active ? '#1A1108' : '#E8DCC8',
        background: active ? '#D4A640' : 'transparent',
        transition: 'all 0.2s ease'
      }
    }, label);
  })), isHolidays && React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: vp.isMobile ? 12.5 : 13,
      color: '#C9A97A',
      margin: '10px 0 4px',
      lineHeight: 1.5
    }
  }, lang === 'vec' ? 'In sti dì de festa sémo serài.' : en ? 'We are closed on the following holidays.' : 'Nei seguenti giorni festivi restiamo chiusi.'), (season === 'standard' || isInverno) && React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 11.5 : 12,
      color: '#C9A97A',
      margin: '10px 0 4px',
      lineHeight: 1.5
    }
  }, lang === 'vec' ? `Orario ${season === 'standard' ? 'de l\'istà' : 'de l\'inverno'} — ${getDstRangeLabel(new Date().getFullYear(), season === 'standard' ? 'estate' : 'inverno')}` : en ? `${season === 'standard' ? 'Summer' : 'Winter'} hours — ${getDstRangeLabel(new Date().getFullYear(), season === 'standard' ? 'estate' : 'inverno', 'en')}` : `Orario ${season === 'standard' ? 'estivo' : 'invernale'} — ${getDstRangeLabel(new Date().getFullYear(), season === 'standard' ? 'estate' : 'inverno')}`), isHolidays ? React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, holidays.map(({
    name,
    date
  }, i) => React.createElement("div", {
    key: name,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '12px 0',
      borderTop: i === 0 ? 'none' : '1px solid rgba(232,220,200,0.10)',
      gap: 14
    }
  }, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 13 : 14,
      fontWeight: 600,
      color: '#FDFAF4',
      letterSpacing: '0.01em'
    }
  }, lang === 'vec' ? HOLIDAY_NAME_VEC[name] || name : en ? HOLIDAY_NAME_EN[name] || name : name), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 13 : 14,
      color: '#C9A97A',
      fontStyle: 'italic',
      textAlign: 'right',
      whiteSpace: 'nowrap'
    }
  }, date)))) : React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, hours.map(({
    day,
    times,
    closed,
    note,
    highlight
  }, i) => React.createElement("div", {
    key: day,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '12px 0',
      borderTop: i === 0 ? 'none' : '1px solid rgba(232,220,200,0.10)',
      gap: 14
    }
  }, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 13 : 14,
      fontWeight: 600,
      color: closed ? '#6B4C33' : highlight ? '#E7B65A' : '#FDFAF4',
      letterSpacing: '0.01em',
      minWidth: 90
    }
  }, lang === 'vec' ? DAY_NAMES_VEC[DAY_NAMES_IT.indexOf(day)] : en ? DAY_NAMES_EN[DAY_NAMES_IT.indexOf(day)] : day), React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, times.map(t => React.createElement("div", {
    key: t,
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 13 : 14,
      color: closed ? '#6B4C33' : highlight ? '#E7B65A' : '#C9A97A',
      fontStyle: closed ? 'italic' : 'normal',
      lineHeight: 1.7
    }
  }, lang === 'vec' && t === 'Chiuso' ? 'Serà' : t)), note && React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 11,
      color: '#6B4C33',
      marginTop: 2
    }
  }, lang === 'vec' ? 'Serà de basora' : en ? 'Closed in the afternoon' : note)))))))), React.createElement(HoursTester, null), React.createElement(ScrollReveal, {
    style: {
      marginTop: vp.isMobile ? 40 : 64
    }
  }, React.createElement("div", {
    id: "inquiry-form",
    style: {
      background: '#FDFAF4',
      borderRadius: 16,
      padding: vp.isMobile ? '32px 22px' : '44px 48px',
      boxShadow: '0 2px 12px rgba(26,17,8,0.08)',
      border: '1px solid rgba(26,17,8,0.06)',
      scrollMarginTop: 80
    }
  }, React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: vp.isMobile ? '1fr' : '1fr 1.2fr',
      gap: vp.isMobile ? 24 : 48,
      alignItems: 'start'
    }
  }, React.createElement("div", null, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#C8251D',
      marginBottom: 12
    }
  }, lang === 'vec' ? 'Informazion e curiosità' : en ? 'Info & Questions' : 'Informazioni e curiosità'), React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: vp.isPhone ? 24 : vp.isMobile ? 28 : 32,
      fontWeight: 700,
      color: '#1A1108',
      marginBottom: 14,
      lineHeight: 1.2,
      letterSpacing: '-0.01em'
    }
  }, lang === 'vec' ? "Gheto 'na domanda?" : en ? 'Have a Question?' : 'Hai una domanda?'), React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 14 : 15,
      color: '#3D2B1A',
      lineHeight: 1.75,
      marginBottom: 16
    }
  }, lang === 'vec' ? React.createElement(React.Fragment, null, "Scrìvine par ", React.createElement("strong", null, "informazion generali"), ", consigli o curiosità su la nostra storia e la nostra roba.") : en ? React.createElement(React.Fragment, null, "Write to us for ", React.createElement("strong", null, "general information"), ", suggestions or questions about our history and products.") : React.createElement(React.Fragment, null, "Scrivici per ", React.createElement("strong", null, "informazioni generali"), ", suggerimenti o curiosità sulla nostra storia e i nostri prodotti.")), React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: 13,
      color: '#6B4C33',
      lineHeight: 1.6
    }
  }, lang === 'vec' ? 'Par órdini, prenotazion e ceste regalo, ciàmane al nùmaro qua sora o fà un salto in botéga.' : en ? 'For orders, reservations and gift baskets, please call us at the number above or stop by the shop.' : 'Per ordini, prenotazioni e ceste regalo, ti preghiamo di chiamarci al numero qui sopra o passare in negozio.'), React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: '#3D2B1A',
      lineHeight: 1.7,
      marginTop: 18
    }
  }, lang === 'vec' ? 'O scrìvine da la to posta:' : en ? 'Or write from your own mail:' : 'Oppure scrivici dalla tua posta:', ' ', React.createElement("a", {
    href: 'mailto:' + CONTACT_EMAIL,
    style: {
      color: '#C8251D',
      fontWeight: 600,
      textDecoration: 'none',
      borderBottom: '1px solid rgba(200,37,29,0.35)'
    }
  }, CONTACT_EMAIL))), React.createElement("div", null, sent ? React.createElement("div", {
    style: {
      background: '#F5F0E6',
      borderRadius: 14,
      padding: '36px 28px',
      textAlign: 'center',
      border: '1px solid rgba(26,17,8,0.06)',
      animation: 'contact-success-pop 1s cubic-bezier(0.16,1,0.3,1)'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      fontWeight: 600,
      color: '#1A1108',
      marginBottom: 8
    }
  }, lang === 'vec' ? 'Grazie!' : en ? 'Thank you!' : 'Grazie!'), React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: '#6B4C33',
      lineHeight: 1.6
    }
  }, lang === 'vec' ? React.createElement(React.Fragment, null, "Gavémo ciapà el to mesajo.", React.createElement("br", null), "Te rispondémo pì presto che podémo.") : en ? React.createElement(React.Fragment, null, "We've received your message.", React.createElement("br", null), "We'll get back to you soon.") : React.createElement(React.Fragment, null, "Abbiamo ricevuto il tuo messaggio.", React.createElement("br", null), "Ti risponderemo al più presto."))) : React.createElement("form", {
    onSubmit: async e => {
      e.preventDefault();
      const f = e.currentTarget,
        d = new FormData(f);
      if (!CONTACT_FORM_KEY) {
        const body = [d.get('name'), d.get('email'), '', d.get('message')].join('\n');
        window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent('SITO — ' + (d.get('name') || 'messaggio')) + '&body=' + encodeURIComponent(body);
        setSent(true);
        return;
      }
      setSending(true);
      try {
        const send = k => fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            access_key: k,
            subject: 'Sito Piva — ' + (d.get('name') || 'nuovo messaggio'),
            from_name: d.get('name'),
            name: d.get('name'),
            email: d.get('email'),
            message: d.get('message')
          })
        });
        const results = await Promise.all([send(CONTACT_FORM_KEY), CONTACT_FORM_KEY_2 ? send(CONTACT_FORM_KEY_2) : Promise.resolve({
          ok: true
        })]);
        if (!results[0].ok) throw new Error();
        setSent(true);
      } catch (err) {
        setSendError(true);
      } finally {
        setSending(false);
      }
    }
  }, React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, lang === 'vec' ? 'Nome e Cognome' : en ? 'Full Name' : 'Nome e Cognome'), React.createElement("input", {
    name: "name",
    type: "text",
    placeholder: en ? 'John Smith' : 'Mario Rossi',
    required: true
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, "Email"), React.createElement("input", {
    name: "email",
    type: "email",
    placeholder: en ? 'john@example.com' : 'mario@esempio.it',
    required: true
  })), React.createElement("div", {
    className: "field"
  }, React.createElement("label", null, lang === 'vec' ? 'Messajo' : en ? 'Message' : 'Messaggio'), React.createElement("textarea", {
    name: "message",
    rows: "4",
    placeholder: lang === 'vec' ? 'Scrivi qua la to domanda…' : en ? 'Write your question here…' : 'Scrivi qui la tua domanda…',
    required: true
  })), React.createElement("button", {
    type: "submit",
    disabled: sending,
    style: {
      background: '#C8251D',
      color: '#fff',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: 600,
      padding: '13px 28px',
      borderRadius: 999,
      border: 'none',
      cursor: 'pointer',
      letterSpacing: '0.04em',
      boxShadow: '0 4px 16px rgba(200,37,29,0.30)',
      transition: 'all 0.25s ease',
      width: vp.isMobile ? '100%' : undefined
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = '#9E1C16';
      e.currentTarget.style.transform = 'translateY(-1px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = '#C8251D';
      e.currentTarget.style.transform = 'translateY(0)';
    }
  }, sending ? lang === 'vec' ? 'Mandémo…' : en ? 'Sending…' : 'Invio…' : lang === 'vec' ? 'Manda el mesajo' : en ? 'Send Message' : 'Invia messaggio'), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      color: '#6B4C33',
      marginTop: 12,
      fontStyle: 'italic',
      lineHeight: 1.5
    }
  }, lang === 'vec' ? React.createElement(React.Fragment, null, "Modulo par ", React.createElement("strong", null, "informazion generali"), ". No sta doparlo par ordini o prenotazion.") : en ? React.createElement(React.Fragment, null, "Form for ", React.createElement("strong", null, "general information"), ". Do not use this for orders or reservations.") : React.createElement(React.Fragment, null, "Modulo per ", React.createElement("strong", null, "informazioni generali"), ". Non utilizzare per ordini o prenotazioni.")), sendError && React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12.5,
      color: '#C8251D',
      marginTop: 10,
      lineHeight: 1.6
    }
  }, lang === 'vec' ? 'No semo riussìi a mandar el mesajo. Prova da novo, o scrìvine a ' : en ? "We couldn't send your message. Please try again, or write to " : 'Non siamo riusciti a inviare il messaggio. Riprova, oppure scrivici a ', React.createElement("a", {
    href: 'mailto:' + CONTACT_EMAIL,
    style: {
      color: '#C8251D',
      fontWeight: 600
    }
  }, CONTACT_EMAIL))))))));
}
function getSectionInSeasonImgs(sectionId) {
  const dishByName = {};
  MENU_DISHES.forEach(d => {
    dishByName[d.name] = d;
  });
  const season = getSeasonForDate(new Date());
  const section = MENU_SECTIONS.find(s => s.id === sectionId);
  if (!section) return [];
  return section.dishes.map(n => dishByName[n]).filter(Boolean).filter(d => !d.season || d.season === season).map(d => ({
    src: d.src,
    name: d.name
  }));
}
function RotatingTileImg({
  imgs,
  fallback,
  alt,
  height
}) {
  const list = imgs && imgs.length ? imgs : [{
    src: fallback,
    name: alt
  }];
  const [idx, setIdx] = React.useState(0);
  const [inView, setInView] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => setInView(entry.isIntersecting));
    }, {
      threshold: 0.4
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  React.useEffect(() => {
    if (list.length <= 1 || !inView) return;
    const id = setInterval(() => setIdx(i => (i + 1) % list.length), 5500);
    return () => clearInterval(id);
  }, [list.length, inView]);
  return React.createElement("div", {
    ref: ref,
    style: {
      position: 'relative',
      width: '100%',
      height,
      background: '#fff',
      overflow: 'hidden'
    }
  }, list.map((it, i) => React.createElement("img", {
    key: it.src + i,
    src: it.src,
    alt: it.name || alt,
    loading: "lazy",
    decoding: "async",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      opacity: i === idx % list.length ? 1 : 0,
      transition: 'opacity 0.6s ease'
    }
  })), list.length > 1 && React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 8,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      gap: 5
    }
  }, list.map((_, i) => React.createElement("span", {
    key: i,
    style: {
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: i === idx % list.length ? '#FDFAF4' : 'rgba(253,250,244,0.45)',
      boxShadow: '0 0 2px rgba(0,0,0,0.4)'
    }
  }))));
}
function AnimatedStat({
  n,
  l,
  numStyle
}) {
  const match = String(n).match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : '';
  const ref = React.useRef(null);
  const [display, setDisplay] = useState(target === null ? n : '0' + suffix);
  useEffect(() => {
    if (target === null) return;
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDisplay(n);
      return;
    }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const duration = 1400;
          const start = performance.now();
          const tick = now => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(target * eased) + suffix);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      });
    }, {
      threshold: 0.4
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, suffix, n]);
  return React.createElement("div", {
    className: "stat",
    ref: ref
  }, React.createElement("div", {
    className: "stat-num",
    style: numStyle
  }, display), React.createElement("div", {
    className: "stat-label"
  }, l));
}
function HomePage({
  onNavigate
}) {
  const vp = useViewport();
  const lang = useLang().lang;
  const en = lang === 'en';
  const primiImgs = React.useMemo(() => getSectionInSeasonImgs('primi'), []);
  const secondiImgs = React.useMemo(() => getSectionInSeasonImgs('secondi'), []);
  const prodottiImgs = React.useMemo(() => getSectionInSeasonImgs('prodotti'), []);
  const ricetteImgs = React.useMemo(() => {
    const season = getSeasonForDate(new Date());
    const inSeason = RECIPES.filter(r => !r.season || r.season === season).map(r => ({
      src: r.img,
      name: r.name
    }));
    return [{
      src: window.IMGS.piattiStagionali,
      name: 'Ricette'
    }, ...inSeason];
  }, []);
  const foodImgs = [{
    rotate: primiImgs,
    fallback: window.IMGS.pastaFresca,
    label: lang === 'vec' ? 'Primi Piati' : en ? 'First Courses' : 'Primi Piatti',
    anchor: 'section-primi'
  }, {
    rotate: secondiImgs,
    fallback: window.IMGS.ricetteFeste,
    label: lang === 'vec' ? 'Secondi Piati' : en ? 'Main Courses' : 'Secondi Piatti',
    anchor: 'section-secondi'
  }, {
    rotate: prodottiImgs,
    fallback: window.IMGS.prodottiQualita,
    label: lang === 'vec' ? 'Ròba Bòna' : en ? 'Quality Products' : 'Prodotti di qualità',
    anchor: 'section-prodotti'
  }, {
    rotate: ricetteImgs,
    fallback: window.IMGS.piattiStagionali,
    label: lang === 'vec' ? 'Ricéte' : en ? 'Recipes' : 'Ricette',
    page: 'ricette'
  }];
  const previewCols = vp.isPhone ? 2 : vp.isMobile ? 2 : 4;
  return React.createElement(React.Fragment, null, React.createElement(Hero, {
    onNavigate: onNavigate
  }), React.createElement("div", {
    className: "stats-bar",
    style: vp.isMobile ? {
      padding: '24px 16px'
    } : undefined
  }, React.createElement("div", {
    className: "stats-inner",
    style: vp.isMobile ? {
      flexWrap: 'wrap',
      gap: 16
    } : undefined
  }, [['1960', lang === 'vec' ? 'Ano de fondazion' : en ? 'Founded' : 'Anno di fondazione'], ['2', lang === 'vec' ? 'Generazion' : en ? 'Generations' : 'Generazioni'], ['200+', lang === 'vec' ? 'Piati fati' : en ? 'Dishes Prepared' : 'Piatti preparati'], [`${new Date().getFullYear() - 1960}+`, lang === 'vec' ? 'Ani de tradizion' : en ? 'Years of Tradition' : 'Anni di tradizione']].map(([n, l]) => React.createElement("div", {
    key: n,
    style: vp.isMobile ? {
      flex: '1 1 40%'
    } : undefined
  }, React.createElement(AnimatedStat, {
    n: n,
    l: l,
    numStyle: vp.isMobile ? {
      fontSize: 30
    } : undefined
  }))))), React.createElement("div", {
    style: {
      background: '#FDFAF4',
      padding: vp.isMobile ? '48px 20px' : '80px 40px'
    }
  }, React.createElement(RevealSection, {
    storageKey: "piva_hero_assembled",
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: vp.isMobile ? '1fr' : '1fr 1fr',
      gap: vp.isMobile ? 32 : 64,
      alignItems: 'center'
    }
  }, React.createElement("div", null, React.createElement(SlideInLine, {
    index: 0
  }, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 10 : 11,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: '#C8251D',
      marginBottom: 14
    }
  }, lang === 'vec' ? 'La storia nostra' : en ? 'Our Story' : 'La nostra storia')), React.createElement(SlideInLine, {
    index: 1
  }, React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: vp.isPhone ? 26 : vp.isMobile ? 30 : 36,
      fontWeight: 700,
      color: '#1A1108',
      lineHeight: 1.2,
      marginBottom: 18
    }
  }, lang === 'vec' ? 'Granda profesionalità e tanta cortesia' : en ? 'Great Professionalism and Kindness' : 'Grande professionalità e gentilezza')), React.createElement(SlideInLine, {
    index: 2
  }, React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 14 : 15,
      color: '#3D2B1A',
      lineHeight: 1.8,
      marginBottom: 28
    }
  }, lang === 'vec' ? "Da do generazion, la fameia Piva la porta in tòla i savori veri del Polesine. Da la salumeria in scartoso infina a la gastronomia, ogni piato el xe fato co' roba fresca sielta tute le matine, prima che el sol el sia in pìe!" : en ? 'For two generations, the Piva family has brought the authentic flavors of the Polesine to the table. From the delicatessen to the prepared foods, every dish is made with fresh ingredients selected every morning.' : 'Da due generazioni, la famiglia Piva porta in tavola i sapori autentici del Polesine. Dalla salumeria alla gastronomia, ogni piatto è preparato con ingredienti freschi selezionati ogni mattina.')), React.createElement(SlideInLine, {
    index: 3
  }, React.createElement("button", {
    onClick: () => onNavigate('about'),
    style: {
      background: 'transparent',
      color: '#C8251D',
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      fontWeight: 600,
      padding: '10px 22px',
      borderRadius: 999,
      border: '1.5px solid #C8251D',
      cursor: 'pointer',
      letterSpacing: '0.04em',
      transition: 'all 0.25s ease'
    },
    onMouseEnter: e => e.currentTarget.style.background = '#F9EAEA',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, lang === 'vec' ? 'Varda la nostra storia' : en ? 'Discover Our Story' : 'Scopri la nostra storia'))), React.createElement("div", {
    style: {
      borderRadius: 12,
      overflow: 'hidden',
      background: '#FDFAF4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, React.createElement(AssembleImage, {
    src: window.IMGS.stillLife,
    alt: "Selezione di specialità F.lli Piva — prosciutto di Parma, tortellini, aceto balsamico e conserve"
  })))), React.createElement("div", {
    style: {
      padding: vp.isMobile ? '48px 20px' : '72px 40px',
      maxWidth: 1200,
      margin: '0 auto'
    }
  }, React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: vp.isMobile ? 28 : 40
    }
  }, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 10 : 11,
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: '#C8251D',
      marginBottom: 10
    }
  }, lang === 'vec' ? 'Ogni dì freschi' : en ? 'Fresh Every Day' : 'Ogni giorno freschi'), React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: vp.isPhone ? 26 : vp.isMobile ? 30 : 36,
      fontWeight: 700,
      color: '#1A1108'
    }
  }, lang === 'vec' ? 'I nostri piati e la nostra roba' : en ? 'Our Dishes and Products' : 'Nostri piatti e prodotti')), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${previewCols}, 1fr)`,
      gap: vp.isMobile ? 12 : 16,
      marginBottom: vp.isMobile ? 28 : 40
    }
  }, foodImgs.map(({
    src,
    rotate,
    fallback,
    label,
    anchor,
    page
  }) => React.createElement("div", {
    key: label,
    onClick: () => onNavigate(page || 'menu', anchor),
    style: {
      borderRadius: 14,
      overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(26,17,8,0.12)',
      cursor: 'pointer',
      transition: 'transform 0.25s ease'
    },
    onMouseEnter: e => e.currentTarget.style.transform = 'translateY(-4px)',
    onMouseLeave: e => e.currentTarget.style.transform = 'translateY(0)'
  }, rotate ? React.createElement(RotatingTileImg, {
    imgs: rotate,
    fallback: fallback,
    alt: label,
    height: vp.isMobile ? 140 : 180
  }) : React.createElement("img", {
    src: src,
    alt: label,
    loading: "lazy",
    decoding: "async",
    style: {
      width: '100%',
      height: vp.isMobile ? 140 : 180,
      objectFit: 'cover',
      display: 'block'
    }
  }), React.createElement("div", {
    style: {
      padding: vp.isMobile ? '8px 10px' : '10px 14px',
      background: '#FDFAF4'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: vp.isMobile ? 12 : 13,
      fontWeight: 600,
      color: '#1A1108'
    }
  }, label))))), React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, React.createElement("button", {
    onClick: () => onNavigate('menu'),
    style: {
      background: '#C8251D',
      color: '#fff',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: 600,
      padding: '13px 32px',
      borderRadius: 999,
      border: 'none',
      cursor: 'pointer',
      letterSpacing: '0.04em',
      boxShadow: '0 4px 20px rgba(200,37,29,0.30)',
      transition: 'all 0.25s ease'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = '#9E1C16';
      e.currentTarget.style.transform = 'translateY(-2px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = '#C8251D';
      e.currentTarget.style.transform = 'translateY(0)';
    }
  }, lang === 'vec' ? 'Varda tuto el menù' : en ? 'See the Full Menu' : 'Vedi il menù completo'))), React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden'
    }
  }, React.createElement("img", {
    src: window.IMGS.cesteBg,
    alt: "Ceste regalo",
    loading: "lazy",
    decoding: "async",
    style: {
      width: '100%',
      height: vp.isMobile ? 220 : 300,
      objectFit: 'cover',
      display: 'block'
    }
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(26,17,8,0.60)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: vp.isMobile ? 10 : 14,
      padding: '0 20px',
      textAlign: 'center'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: vp.isMobile ? 10 : 11,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: '#D4A640'
    }
  }, lang === 'vec' ? "'Na tradizion che va vanti" : en ? 'A Tradition That Continues' : 'Una tradizione che continua'), React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: vp.isPhone ? 26 : vp.isMobile ? 30 : 36,
      fontWeight: 700,
      color: '#FDFAF4',
      textAlign: 'center',
      maxWidth: 720
    }
  }, lang === 'vec' ? 'Pachéti Regalo & Ceste de Nadal' : en ? 'Gift Packages & Holiday Baskets' : 'Confezioni Regalo & Ceste Natalizie'), React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: vp.isMobile ? 14 : 16,
      color: '#E8DCC8',
      maxWidth: 560
    }
  }, lang === 'vec' ? "Composizion curàe co' la nostra roba, giuste par ogni ocasión." : en ? 'Curated compositions with our products, perfect for any occasion.' : 'Composizioni curate con i nostri prodotti, perfette per ogni occasione.'))));
}
const MUSIC_TRACKS = [{
  src: 'audio/inno-italia-navy-band.mp3',
  title: "Inno d'Italia",
  artist: 'U.S. Navy Band'
}];
const MUSIC_MIME = 'audio/mpeg';
const MUSIC_PLAYS_PER_TRACK = 1;
const MUSIC_NO_REPEAT_WINDOW = 7;
function pickMusicTrack(history) {
  if (MUSIC_TRACKS.length < 2) return 0;
  const recent = history.slice(-Math.min(MUSIC_NO_REPEAT_WINDOW, MUSIC_TRACKS.length - 1));
  const pool = MUSIC_TRACKS.map((_, i) => i).filter(i => recent.indexOf(i) === -1);
  return pool[Math.floor(Math.random() * pool.length)];
}
const MUSIC_VOLUME = 0.35;
const MUSIC_FADE_MS = 5000;
const MUSIC_GAP_MS = 1000;
function MusicPlayer() {
  const vp = useViewport();
  const lang = useLang().lang;
  const audioRef = React.useRef(null);
  const trackRef = React.useRef(0);
  const historyRef = React.useRef([]);
  const playCountRef = React.useRef(0);
  const fadeRef = React.useRef(null);
  const gapRef = React.useRef(null);
  const [playing, setPlaying] = useState(false);
  const [hint, setHint] = useState('');
  const [srcUrl, setSrcUrl] = useState('');
  const [current, setCurrent] = useState(0);
  const [invite, setInvite] = useState(() => {
    try {
      return !sessionStorage.getItem('piva_music_seen');
    } catch (e) {
      return true;
    }
  });
  const dismissInvite = () => {
    setInvite(false);
    try {
      sessionStorage.setItem('piva_music_seen', '1');
    } catch (e) {}
  };
  const loadTrack = React.useCallback(i => {
    return fetch(MUSIC_TRACKS[i].src).then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.arrayBuffer();
    }).then(buf => URL.createObjectURL(new Blob([buf], {
      type: MUSIC_MIME
    })));
  }, []);
  useEffect(() => {
    let alive = true,
      url = '';
    const first = pickMusicTrack(historyRef.current);
    trackRef.current = first;
    historyRef.current = [first];
    setCurrent(first);
    loadTrack(first).then(u => {
      if (!alive) {
        URL.revokeObjectURL(u);
        return;
      }
      url = u;
      setSrcUrl(u);
    }).catch(() => {});
    return () => {
      alive = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [loadTrack]);
  const clearTimers = () => {
    if (fadeRef.current) {
      clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
    if (gapRef.current) {
      clearTimeout(gapRef.current);
      gapRef.current = null;
    }
  };
  useEffect(() => () => clearTimers(), []);
  const fadeTo = (target, done) => {
    const a = audioRef.current;
    if (!a) return;
    if (fadeRef.current) clearInterval(fadeRef.current);
    const step = 60,
      from = a.volume,
      delta = target - from;
    let elapsed = 0;
    fadeRef.current = setInterval(() => {
      elapsed += step;
      const p = Math.min(1, elapsed / MUSIC_FADE_MS);
      a.volume = Math.max(0, Math.min(1, from + delta * p));
      if (p >= 1) {
        clearInterval(fadeRef.current);
        fadeRef.current = null;
        if (done) done();
      }
    }, step);
  };
  const onTimeUpdate = () => {
    const a = audioRef.current;
    if (!a || !a.duration || !isFinite(a.duration) || fadeRef.current) return;
    if (a.duration - a.currentTime <= MUSIC_FADE_MS / 1000 && a.volume > 0.02) fadeTo(0);
  };
  const onEnded = () => {
    const a = audioRef.current;
    if (!a) return;
    clearTimers();
    playCountRef.current += 1;
    if (playCountRef.current >= MUSIC_PLAYS_PER_TRACK) {
      playCountRef.current = 0;
      const next = pickMusicTrack(historyRef.current);
      trackRef.current = next;
      historyRef.current = historyRef.current.concat(next).slice(-MUSIC_NO_REPEAT_WINDOW);
      setCurrent(next);
      if (MUSIC_TRACKS.length > 1) {
        loadTrack(trackRef.current).then(u => {
          const prev = a.src;
          a.src = u;
          a.load();
          if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
          gapRef.current = setTimeout(() => {
            try {
              a.volume = MUSIC_VOLUME;
            } catch (e) {}
            const p = a.play();
            if (p && p.catch) p.catch(() => {});
          }, MUSIC_GAP_MS);
        }).catch(() => {});
        return;
      }
      a.currentTime = 0;
    } else {
      a.currentTime = 0;
    }
    gapRef.current = setTimeout(() => {
      try {
        a.volume = MUSIC_VOLUME;
      } catch (e) {}
      const p = a.play();
      if (p && p.catch) p.catch(() => {});
    }, MUSIC_GAP_MS);
  };
  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    dismissInvite();
    if (playing) {
      clearTimers();
      a.pause();
      return;
    }
    setHint('');
    try {
      a.volume = MUSIC_VOLUME;
    } catch (e) {}
    const p = a.play();
    if (p && p.catch) p.catch(err => setHint((err && err.name ? err.name + ': ' : '') + (err && err.message || 'play failed')));
  };
  const track = MUSIC_TRACKS[current] || MUSIC_TRACKS[0];
  const label = playing ? lang === 'vec' ? 'Smorza la mùsica' : lang === 'en' ? 'Mute music' : 'Silenzia la musica' : lang === 'vec' ? 'Impìsa la mùsica' : lang === 'en' ? 'Play music' : 'Ascolta la musica';
  const hintText = lang === 'vec' ? 'Controla che el telèfono no sia in silensioso, po prova de novo.' : lang === 'en' ? 'Check your device is not on silent, then try again.' : 'Controlla che il dispositivo non sia in silenzioso, poi riprova.';
  if (!srcUrl) return null;
  return React.createElement(React.Fragment, null, React.createElement("audio", {
    ref: audioRef,
    src: srcUrl,
    preload: "auto",
    playsInline: true,
    onPlay: () => {
      setPlaying(true);
      setHint('');
    },
    onPause: () => setPlaying(false),
    onTimeUpdate: onTimeUpdate,
    onEnded: onEnded,
    onError: () => {
      const a = audioRef.current;
      setHint('audio error ' + (a && a.error && a.error.code || '?'));
    }
  }), hint && React.createElement("div", {
    role: "status",
    style: {
      position: 'fixed',
      left: vp.isMobile ? 14 : 20,
      bottom: vp.isMobile ? 108 : 118,
      zIndex: 200,
      maxWidth: 210,
      background: '#1A1108',
      color: '#F5F0E6',
      borderRadius: 10,
      padding: '9px 12px',
      fontFamily: 'var(--font-body)',
      fontSize: 11.5,
      lineHeight: 1.5,
      boxShadow: '0 8px 24px rgba(26,17,8,0.28)'
    }
  }, hintText, React.createElement("div", {
    style: {
      marginTop: 6,
      opacity: 0.7,
      fontSize: 10
    }
  }, hint)), playing && React.createElement("div", {
    "aria-live": "polite",
    style: {
      position: 'fixed',
      left: vp.isMobile ? 14 : 20,
      bottom: vp.isMobile ? 64 : 70,
      zIndex: 200,
      maxWidth: vp.isMobile ? 210 : 250,
      background: '#1A1108',
      color: '#F5F0E6',
      borderRadius: 10,
      padding: '7px 11px',
      border: '1px solid rgba(212,166,64,0.4)',
      boxShadow: '0 6px 18px rgba(26,17,8,0.24)',
      fontFamily: 'var(--font-body)',
      fontSize: 11.5,
      lineHeight: 1.35
    }
  }, React.createElement("div", {
    style: {
      fontSize: 9,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#D4A640',
      marginBottom: 2
    }
  }, lang === 'vec' ? 'Sonàndo' : lang === 'en' ? 'Now playing' : 'In riproduzione'), React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 13.5
    }
  }, track.title), track.artist && React.createElement("div", {
    style: {
      opacity: 0.65,
      fontSize: 10.5,
      marginTop: 1
    }
  }, track.artist)), React.createElement("div", {
    style: {
      position: 'fixed',
      left: vp.isMobile ? 14 : 20,
      bottom: vp.isMobile ? 14 : 20,
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, React.createElement("button", {
    onClick: toggle,
    "aria-label": label,
    title: label,
    style: {
      width: 44,
      height: 44,
      borderRadius: '50%',
      background: playing ? '#C8251D' : invite ? '#C8251D' : '#1A1108',
      color: '#FDFAF4',
      border: '1.5px solid rgba(212,166,64,0.55)',
      cursor: 'pointer',
      boxShadow: '0 4px 16px rgba(26,17,8,0.28)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.25s ease',
      flex: '0 0 auto',
      animation: invite ? 'music-invite 2.2s ease-in-out infinite' : 'none'
    }
  }, playing ? React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round"
  }, React.createElement("path", {
    d: "M11 5 6 9H3v6h3l5 4V5Z"
  }), React.createElement("path", {
    d: "M22 9l-6 6M16 9l6 6"
  })) : React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round"
  }, React.createElement("path", {
    d: "M11 5 6 9H3v6h3l5 4V5Z"
  }), React.createElement("path", {
    d: "M16 8.5a4 4 0 0 1 0 7M19 6a7 7 0 0 1 0 12"
  }))), invite && React.createElement("div", {
    "aria-hidden": "true",
    style: {
      background: '#C8251D',
      color: '#FDFAF4',
      borderRadius: 999,
      padding: '6px 12px',
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      boxShadow: '0 4px 16px rgba(200,37,29,0.32)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      animation: 'music-invite-pill 2.2s ease-in-out infinite'
    }
  }, lang === 'vec' ? 'Sc-iòca par la mùsica' : lang === 'en' ? 'Click for music' : 'Clicca per la musica')));
}
function App() {
  const [page, setPage] = useState('home');
  const [lang, setLangState] = useState('it');
  const setLang = l => setLangState(l);
  const pendingAnchorRef = React.useRef(null);
  const navigate = (p, anchor) => {
    pendingAnchorRef.current = anchor || null;
    setPage(p);
  };
  useEffect(() => {
    const anchor = pendingAnchorRef.current;
    pendingAnchorRef.current = null;
    if (anchor) {
      const el = document.getElementById(anchor);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({
          top,
          behavior: 'smooth'
        });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [page]);
  return React.createElement(LangContext.Provider, {
    value: {
      lang,
      setLang
    }
  }, React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }
  }, React.createElement(Header, {
    activePage: page,
    onNavigate: navigate
  }), React.createElement(LangBar, {
    onNavigate: navigate
  }), React.createElement(DialectMarquee, null), React.createElement("main", {
    style: {
      flex: 1
    }
  }, page === 'home' && React.createElement(HomePage, {
    onNavigate: navigate
  }), page === 'menu' && React.createElement(MenuSection, null), page === 'about' && React.createElement(AboutPage, null), page === 'contact' && React.createElement(ContactPage, null), page === 'ricette' && React.createElement(RecipePage, null)), React.createElement(Footer, {
    onNavigate: navigate
  }), React.createElement(MusicPlayer, null)));
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App, null));
