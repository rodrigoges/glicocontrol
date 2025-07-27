import React, { useState, useEffect, useCallback } from 'react';
import { Measurement, User } from '../types';
import { classifyGlucose } from '../services/geminiService';
import { getMeasurements, saveMeasurement } from '../services/firebaseService';
import Header from './Header';
import GlucoseInputForm from './GlucoseInputForm';
import HistoryTable from './HistoryTable';

interface DashboardProps {
    user: User;
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Carrega medições do Firestore ao montar
        setIsLoading(true);
        setError(null);
        getMeasurements(user.id)
            .then((data) => setMeasurements(data))
            .catch((err) => {
                setError("Não foi possível carregar os dados do Firestore.");
                console.error(err);
            })
            .finally(() => setIsLoading(false));
    }, [user.id]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const glucoseValue = parseInt(inputValue, 10);
        if (isNaN(glucoseValue) || glucoseValue <= 0) {
            setError('Por favor, insira um valor de glicemia válido.');
            return;
        }
        setIsLoading(true);
        try {
            const classificationResult = await classifyGlucose(glucoseValue);
            const newMeasurement: Measurement = {
                id: crypto.randomUUID(),
                value: glucoseValue,
                classification: classificationResult,
                date: new Date().toISOString(),
            };
            await saveMeasurement(user.id, newMeasurement);
            setMeasurements(prev => [newMeasurement, ...prev]);
            setInputValue('');
        } catch (err) {
            console.error('Error saving glucose:', err);
            setError('Ocorreu um erro ao salvar a glicemia no Firestore. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    }, [inputValue, user.id]);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-4xl mx-auto">
                <Header user={user} onLogout={onLogout} />
                <main className="mt-8 bg-white p-6 sm:p-8 rounded-xl shadow-md">
                    <section id="input-section">
                        <h2 className="text-xl font-bold mb-4">Novo Registro</h2>
                        <GlucoseInputForm
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onSubmit={handleSubmit}
                            isLoading={isLoading}
                        />
                        {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
                    </section>

                    <section id="history-section" className="mt-10">
                         <HistoryTable measurements={measurements} />
                    </section>
                </main>
                <footer className="text-center mt-8 text-gray-500 text-xs">
                    <p>GlicoControl &copy; {new Date().getFullYear()}. Dados de {user.name} salvos localmente.</p>
                </footer>
            </div>
        </div>
    );
};

export default Dashboard;