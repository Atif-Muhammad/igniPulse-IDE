import { useEffect, useRef } from "react";

const Ads = () => {
  const adRef = useRef(null);

  useEffect(() => {
    const pushAds = () => {
      try {
        if (window.adsbygoogle && adRef.current) {
          window.adsbygoogle.push({});
        }
      } catch (e) {
        console.error("Adsense error:", e);
      }
    };

    // Check if the script is already loaded
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement("script");
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2917906237665869";
      script.async = true;
      script.crossOrigin = "anonymous";
      script.onload = pushAds;
      document.body.appendChild(script);
    } else {
      pushAds();
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
    //   style={{ display: "block" }}
      data-ad-client="ca-pub-2917906237665869"
      data-ad-slot="2932306120"
      data-ad-format="auto"
      data-full-width-responsive="true"
      ref={adRef}
    />
  );
};

export default Ads;
