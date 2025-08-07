
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CTASection: React.FC = () => {
  return (
    <section className="py-12 bg-brand-chartreuse/10 relative overflow-hidden my-0">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Vous gérez une conciergerie Airbnb ?</h2>
          <p className="text-xl text-gray-600 mb-6">
            Inscrivez votre entreprise gratuitement sur ProprioAdvisor pour augmenter votre visibilité et <a href="https://proprioadvisor.fr/trouver-des-clients-conciergerie-airbnb" className="text-brand-chartreuse hover:underline">trouver de nouveaux clients</a>.
          </p>
          <Button className="text-lg px-6 py-3" asChild>
            <Link href="/inscription">
              Ajouter ma conciergerie
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;


