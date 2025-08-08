"use client";

import React, { useEffect } from "react";
import Head from "next/head";
import { Calendar } from "lucide-react";
const PrendreRdv = () => {
  useEffect(() => {
    // Load Cal.com script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      (function (C, A, L) { 
        let p = function (a, ar) { a.q.push(ar); }; 
        let d = C.document; 
        C.Cal = C.Cal || function () { 
          let cal = C.Cal; 
          let ar = arguments; 
          if (!cal.loaded) { 
            cal.ns = {}; 
            cal.q = cal.q || []; 
            d.head.appendChild(d.createElement("script")).src = A; 
            cal.loaded = true; 
          } 
          if (ar[0] === L) { 
            const api = function () { p(api, arguments); }; 
            const namespace = ar[1]; 
            api.q = api.q || []; 
            if(typeof namespace === "string"){
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initNamespace", namespace]);
            } else p(cal, ar); 
            return;
          } 
          p(cal, ar); 
        }; 
      })(window, "https://app.cal.com/embed/embed.js", "init");
      
      Cal("init", "proprioadvisor", {origin:"https://cal.com"});
      
      Cal.ns.proprioadvisor("inline", {
        elementOrSelector:"#my-cal-inline",
        config: {"layout":"month_view"},
        calLink: "david-vauclin/proprioadvisor",
      });
      
      Cal.ns.proprioadvisor("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
    `;
    document.head.appendChild(script);
    return () => {
      // Cleanup if needed
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);
  return <div className="py-12 bg-gradient-to-b from-white to-gray-50">
      <Head>
        <title>Prendre rendez-vous | Proprioadvisor</title>
        <meta name="description" content="Prenez rendez-vous avec notre équipe pour discuter de vos besoins en conciergerie Airbnb" />
        <link rel="canonical" href="https://proprioadvisor.fr/prendre-rdv" />
      </Head>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 mb-4 text-brand-chartreuse flex items-center justify-center">
              <Calendar size={64} />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Prendre rendez-vous</h1>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left max-w-2xl mx-auto">
              <p className="text-lg text-gray-700 leading-relaxed">Réservez un créneau si vous avez une question ou souhaitez discuter de votre visibilité sur Proprioadvisor. Prenons quelques minutes ensemble pour en parler.</p>
            </div>
          </div>

          {/* Cal.com Calendar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Choisissez votre créneau</h2>
            <div style={{
            width: '100%',
            height: '600px',
            overflow: 'scroll'
          }} id="my-cal-inline" className="border border-gray-100 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>;
};
export default PrendreRdv;

