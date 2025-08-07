"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Head from "next/head";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { House } from "lucide-react";
import StructuredData from "@/components/seo/StructuredData";
import { createSimulatorStructuredData } from "@/utils/structuredDataHelpers";

// Define calculation model types
type PropertyType = "standard" | "standardPlus" | "hautDeGamme" | "luxe";
type LocationType = "centreville" | "historique" | "residentiel" | "banlieue" | "rural";
type Region = "idf" | "paca" | "ara" | "bretagne" | "nouvelleaquitaine" | "occitanie" | "other";

interface SimulatorFormValues {
  region: Region;
  isBalnear: boolean;
  cityPopulation: number;
  location: LocationType;
  propertyType: PropertyType;
  area: number;
  bedrooms: number;
  occupancyRate: number;
}

const Simulator = () => {
  const form = useForm<SimulatorFormValues>({
    defaultValues: {
      region: "paca",
      isBalnear: true,
      cityPopulation: 100000,
      location: "centreville",
      propertyType: "standard",
      area: 50,
      bedrooms: 2,
      occupancyRate: 60
    }
  });

  const [results, setResults] = useState<{
    baseNightlyRate: number;
    adjustedNightlyRate: number;
    monthlyRevenueLow: number;
    monthlyRevenueHigh: number;
    conciergeRevenueLow: number;
    conciergeRevenueHigh: number;
    conciergeCostLow: number;
    conciergeCostHigh: number;
    conciergeNetLow: number;
    conciergeNetHigh: number;
    managementTimeWithoutConcierge: string;
  } | null>(null);

  // Calculate results when form values change - optimized with useCallback
  const calculateResults = useCallback((values: SimulatorFormValues) => {
    // Step 1: Calculate base nightly rate
    let baseRate = 50; // Base value

    // Add balnear bonus
    if (values.isBalnear) {
      baseRate += 20;
    }

    // Add population bonus
    baseRate += values.cityPopulation * 0.00005;

    // Add region bonus - CORRECTED VALUES
    switch (values.region) {
      case "idf":
        baseRate += 100;
        break;
      case "paca":
        baseRate += 50;
        break;
      case "ara":
      case "bretagne":
      case "nouvelleaquitaine":
        baseRate += 40;
        break;
      case "occitanie":
        baseRate += 35;
        break;
      default:
        baseRate += 22.5;
      // Average between 20 and 25
    }

    // Add location bonus - CORRECTED VALUES
    switch (values.location) {
      case "centreville":
        baseRate += 30;
        break;
      case "historique":
        baseRate += 20;
        break;
      case "residentiel":
        baseRate += 0; // Neutral (no change)
        break;
      case "banlieue":
        baseRate -= 10; // Negative impact
        break;
      case "rural":
        baseRate -= 20; // Negative impact
        break;
    }

    // Step 2: Apply property type multiplier - CORRECTED VALUES
    let propertyTypeMultiplier = 1.0;
    switch (values.propertyType) {
      case "standard":
        propertyTypeMultiplier = 1.0; // No modification
        break;
      case "standardPlus":
        propertyTypeMultiplier = 1.15; // +15%
        break;
      case "hautDeGamme":
        propertyTypeMultiplier = 1.5; // +50%
        break;
      case "luxe":
        propertyTypeMultiplier = 2.0; // +100%
        break;
    }

    // Area multiplier - Increment of 5% for every 10 m²
    const areaMultiplier = 1 + Math.floor(values.area / 10) * 0.05;

    // Bedrooms multiplier - CORRECTED CALCULATIONS
    let bedroomsMultiplier = 1.0;
    switch (values.bedrooms) {
      case 1:
        bedroomsMultiplier = 1.0;
        break;
      case 2:
        bedroomsMultiplier = 1.2; // +20%
        break;
      case 3:
        bedroomsMultiplier = 1.35; // +35%
        break;
      case 4:
        bedroomsMultiplier = 1.45; // +45%
        break;
      default:
        if (values.bedrooms >= 5) {
          // 45% base + 5% for each additional bedroom beyond 4
          bedroomsMultiplier = 1.45 + (values.bedrooms - 4) * 0.05;
        }
    }

    // Calculate the total nightly rate by applying all multipliers
    const totalNightlyRate = baseRate * propertyTypeMultiplier * areaMultiplier * bedroomsMultiplier;

    // Step 3: Apply the calibration factor and calculate monthly revenue
    const adjustedNightlyRate = totalNightlyRate / 2.5; // Calibration factor
    const occupancyRateDecimal = values.occupancyRate / 100;
    const monthlyRevenue = adjustedNightlyRate * occupancyRateDecimal * 30; // 30 days per month

    // Step 4: Calculate revenue ranges
    const monthlyRevenueLow = monthlyRevenue * 0.95; // -5%
    const monthlyRevenueHigh = monthlyRevenue * 1.05; // +5%

    // Step 5: Calculate concierge values
    const conciergeRevenueLow = monthlyRevenue * 1.15; // +15%
    const conciergeRevenueHigh = monthlyRevenue * 1.3; // +30%

    const conciergeCostLow = conciergeRevenueLow * 0.2; // 20% fee
    const conciergeCostHigh = conciergeRevenueHigh * 0.2; // 20% fee

    const conciergeNetLow = conciergeRevenueLow - conciergeCostLow;
    const conciergeNetHigh = conciergeRevenueHigh - conciergeCostHigh;

    // Step 6: Management time
    const managementTimeWithoutConcierge = "5 à 8 heures par semaine";
    
    setResults({
      baseNightlyRate: baseRate,
      adjustedNightlyRate,
      monthlyRevenueLow,
      monthlyRevenueHigh,
      conciergeRevenueLow,
      conciergeRevenueHigh,
      conciergeCostLow,
      conciergeCostHigh,
      conciergeNetLow,
      conciergeNetHigh,
      managementTimeWithoutConcierge
    });
  }, []);

  // Watch specific form values to trigger recalculation - optimized to avoid object recreation
  const region = form.watch("region");
  const isBalnear = form.watch("isBalnear");
  const cityPopulation = form.watch("cityPopulation");
  const location = form.watch("location");
  const propertyType = form.watch("propertyType");
  const area = form.watch("area");
  const bedrooms = form.watch("bedrooms");
  const occupancyRate = form.watch("occupancyRate");

  // Recalculate when any form value changes - with specific dependencies
  useEffect(() => {
    const formValues = {
      region,
      isBalnear,
      cityPopulation,
      location,
      propertyType,
      area,
      bedrooms,
      occupancyRate
    };
    calculateResults(formValues);
  }, [region, isBalnear, cityPopulation, location, propertyType, area, bedrooms, occupancyRate, calculateResults]);

  // Calculate on initial render with default values
  useEffect(() => {
    const defaultValues = form.getValues();
    calculateResults(defaultValues);
  }, [calculateResults]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(Math.round(value));
  };

  return <div className="py-[32px]">
      <Head>
        <title>Estimation revenu Airbnb | Simulateur gratuit & immédiat</title>
        <meta name="description" content="Estimez gratuitement et immédiatement vos revenus potentiels sur Airbnb avec notre simulateur." />
      </Head>
      
      <StructuredData data={createSimulatorStructuredData()} />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">Simulateur de revenus Airbnb</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Estimez vos revenus potentiels en location courte durée sur Airbnb en fonction de votre localisation, 
            des caractéristiques de votre bien et de la période de l'année.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Paramètres du bien</h2>
            
            <Form {...form}>
              <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                {/* Location parameters */}
                <div className="space-y-4">
                  <FormField control={form.control} name="region" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Région</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une région" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="idf">Île-de-France</SelectItem>
                            <SelectItem value="paca">PACA / Corse</SelectItem>
                            <SelectItem value="ara">Auvergne-Rhône-Alpes</SelectItem>
                            <SelectItem value="bretagne">Bretagne</SelectItem>
                            <SelectItem value="nouvelleaquitaine">Nouvelle-Aquitaine</SelectItem>
                            <SelectItem value="occitanie">Occitanie</SelectItem>
                            <SelectItem value="other">Autre région</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>} />
                   
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="isBalnear" render={({
                    field
                  }) => <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <input type="checkbox" checked={field.value} onChange={e => field.onChange(e.target.checked)} className="form-checkbox rounded" />
                          </FormControl>
                          <FormLabel className="cursor-pointer">Ville balnéaire</FormLabel>
                        </FormItem>} />
                     
                    <FormField control={form.control} name="cityPopulation" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Nombre d'habitants</FormLabel>
                          <FormControl>
                            <Input type="number" min="1000" step="1000" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                        </FormItem>} />
                  </div>
                   
                  <FormField control={form.control} name="location" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Emplacement</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un emplacement" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="centreville">Centre-ville</SelectItem>
                            <SelectItem value="historique">Quartier historique</SelectItem>
                            <SelectItem value="residentiel">Quartier résidentiel</SelectItem>
                            <SelectItem value="banlieue">Banlieue</SelectItem>
                            <SelectItem value="rural">Zone rurale</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>} />
                </div>
                
                <Separator />
                
                {/* Property parameters */}
                <div className="space-y-4">
                  <FormField control={form.control} name="propertyType" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Type de bien</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="standardPlus">Standard+</SelectItem>
                            <SelectItem value="hautDeGamme">Haut de gamme</SelectItem>
                            <SelectItem value="luxe">Luxe</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>} />
                   
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="area" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Superficie (m²)</FormLabel>
                          <FormControl>
                            <Input type="number" min="10" step="5" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                        </FormItem>} />
                     
                    <FormField control={form.control} name="bedrooms" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Nombre de chambres</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" max="10" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                        </FormItem>} />
                  </div>
                </div>
                
                <Separator />
                
                {/* Occupancy rate */}
                <FormField control={form.control} name="occupancyRate" render={({
                field
              }) => <FormItem>
                      <div className="flex justify-between">
                        <FormLabel>Taux d'occupation</FormLabel>
                        <span>{field.value}%</span>
                      </div>
                      <FormControl>
                        <Slider min={10} max={100} step={5} value={[field.value]} onValueChange={values => field.onChange(values[0])} className="py-4" />
                      </FormControl>
                    </FormItem>} />
              </form>
            </Form>
          </div>
          
          <div>
            {results && <Tabs defaultValue="simulation" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="simulation">Revenus estimés</TabsTrigger>
                  <TabsTrigger value="comparison">Avec conciergerie</TabsTrigger>
                </TabsList>
                
                <TabsContent value="simulation">
                  <Card>
                    <CardHeader>
                      <CardTitle>Estimation de vos revenus Airbnb</CardTitle>
                      <CardDescription>
                        Basée sur les paramètres de votre bien et leur impact sur le prix de la nuitée
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Prix nuitée moyenne</p>
                          <p className="text-lg font-medium">{formatCurrency(results.adjustedNightlyRate)}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Taux d'occupation</p>
                          <p className="text-lg font-medium">{form.getValues().occupancyRate}%</p>
                        </div>
                      </div>
                       
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Revenu mensuel estimé</h3>
                        <div className="p-6 bg-gray-100 rounded-lg text-center">
                          <p className="text-sm text-gray-500 mb-2">Fourchette estimée</p>
                          <p className="text-3xl font-bold text-brand-chartreuse">
                            {formatCurrency(results.monthlyRevenueLow)} - {formatCurrency(results.monthlyRevenueHigh)}
                          </p>
                        </div>
                      </div>
                       
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Temps de gestion estimé</h3>
                        <p className="text-gray-700">{results.managementTimeWithoutConcierge}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="comparison">
                  <Card>
                    <CardHeader>
                      <CardTitle>Comparaison avec conciergerie</CardTitle>
                      <CardDescription>
                        Découvrez l'impact d'une conciergerie sur vos revenus Airbnb
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                          <p className="text-sm text-gray-500 mb-1">Sans conciergerie</p>
                          <p className="text-xl font-medium">
                            {formatCurrency(results.monthlyRevenueLow)} - {formatCurrency(results.monthlyRevenueHigh)}
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg text-center">
                          <p className="text-sm text-gray-500 mb-1">Avec conciergerie</p>
                          <p className="text-xl font-medium text-green-700">
                            {formatCurrency(results.conciergeNetLow)} - {formatCurrency(results.conciergeNetHigh)}
                          </p>
                        </div>
                      </div>
                       
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Détail avec conciergerie</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between p-2 bg-gray-50 rounded">
                            <span>Revenus bruts</span>
                            <span>{formatCurrency(results.conciergeRevenueLow)} - {formatCurrency(results.conciergeRevenueHigh)}</span>
                          </div>
                          <div className="flex justify-between p-2 bg-gray-50 rounded">
                            <span>Coûts conciergerie (20%)</span>
                            <span>-{formatCurrency(results.conciergeCostLow)} - {formatCurrency(results.conciergeCostHigh)}</span>
                          </div>
                          <div className="flex justify-between p-2 font-medium">
                            <span>Revenus nets</span>
                            <span>{formatCurrency(results.conciergeNetLow)} - {formatCurrency(results.conciergeNetHigh)}</span>
                          </div>
                        </div>
                      </div>
                       
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Temps de gestion</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-gray-50 rounded">
                            <p className="text-sm text-gray-500">Sans conciergerie</p>
                            <p className="font-medium">{results.managementTimeWithoutConcierge}</p>
                          </div>
                          <div className="p-3 bg-green-50 rounded">
                            <p className="text-sm text-gray-500">Avec conciergerie</p>
                            <p className="font-medium text-green-700">0 minute</p>
                          </div>
                        </div>
                      </div>
                       
                      <Link href="/">
                        <Button className="w-full py-0 mx-0 my-[20px]">
                          Trouver une conciergerie
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>}
          </div>
        </div>
      </div>
    </div>;
};

export default Simulator;

