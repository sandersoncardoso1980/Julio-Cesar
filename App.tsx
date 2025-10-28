import React, { useState, useEffect, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import Backoffice from './components/Backoffice';
import LoginPage from './components/Login';
import { Lead, AppSettings, NewLeadData } from './types';
import { INITIAL_COMPETITORS, INITIAL_OUR_PLAN, LANDING_PAGE_SAVINGS_PERCENTAGE } from './constants';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';


type View = 'landing' | 'backoffice';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('landing');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings>({
    ourPlan: INITIAL_OUR_PLAN,
    competitors: INITIAL_COMPETITORS,
    landingPageSavingsPercentage: LANDING_PAGE_SAVINGS_PERCENTAGE,
  });

  useEffect(() => {
    const fetchSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setView('landing'); // Go to landing on logout
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Fetch leads
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('createdAt', { ascending: false });
      if (leadsData) setLeads(leadsData as Lead[]);
      
      // Fetch settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('settings')
        .select('data')
        .eq('id', 1)
        .single();
      if (settingsData && settingsData.data) {
          setAppSettings(settingsData.data);
      } else {
        // Optional: Initialize settings if they don't exist
        await supabase.from('settings').insert([{ id: 1, data: appSettings }]);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleNewLead = useCallback(async (newLeadData: NewLeadData) => {
    const { data, error } = await supabase
      .from('leads')
      .insert([newLeadData])
      .select()
      .single();
    
    if (data) {
      setLeads(prevLeads => [data as Lead, ...prevLeads]);
    } else if (error) {
        console.error("Error creating new lead:", error);
    }
  }, []);

  const handleSaveSettings = async (newSettings: AppSettings) => {
    const { error } = await supabase
      .from('settings')
      .update({ data: newSettings })
      .eq('id', 1);

    if (!error) {
      setAppSettings(newSettings);
    } else {
        console.error("Error saving settings:", error);
    }
  };

  const navigateToSellerArea = () => {
    setView('backoffice');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold">A carregar...</div>
      </div>
    );
  }

  if (view === 'backoffice') {
    return session 
        ? <Backoffice leads={leads} appSettings={appSettings} onSaveSettings={handleSaveSettings} />
        : <LoginPage onBack={() => setView('landing')} />;
  }
  
  return <LandingPage onNewLead={handleNewLead} onBackofficeClick={navigateToSellerArea} settings={appSettings} />;
}

export default App;