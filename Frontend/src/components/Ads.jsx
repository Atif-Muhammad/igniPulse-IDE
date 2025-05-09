import { useEffect, useRef, useState } from "react";

const Ads = () => {
  const adRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const loadAdsScript = () => {
      if (scriptLoaded || window.adsbygoogle) {
        setScriptLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2917906237665869";
      script.async = true;
      script.crossOrigin = "anonymous";
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    };

    loadAdsScript();
  }, [scriptLoaded]);

  useEffect(() => {
    if (scriptLoaded && adRef.current) {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        console.error("Adsense error:", e);
      }
    }
  }, [scriptLoaded]);

  return (
    <div className="w-full h-full overflow-hidden flex items-center justify-center bg-red-500">
      <ins
        className="adsbygoogle "
        style={{
          display: "block",
          width: "120px",
        }}
        data-ad-client="ca-pub-2917906237665869"
        data-ad-slot="2932306120"
        data-ad-format="auto"
        data-full-width-responsive="false"
        ref={adRef}
      />
    </div>
  );
};

export default Ads;
