"use client";

import { useState } from "react";

function StandardForm() {
  const [HbA1c_level, setHbA1c_level] = useState("");
  const [blood_glucose_level, setBlood_glucose_level] = useState("");
  const [age, setAge] = useState("");
  const [bmi, setBmi] = useState("");
  const [gender, setGender] = useState("Male");
  const [smokingHistory, setSmokingHistory] = useState("never");
  const [hypertension, setHypertension] = useState("no");
  const [heartDisease, setHeartDisease] = useState("no");
  const [model, setModel] = useState("Balanced");
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [flashState, setFlashState] = useState(null);

  const predictionValue =
    result?.prediction ?? result?.prediction_value ?? result?.pred ?? null;

  const isDiabetic = predictionValue !== null && Number(predictionValue) !== 0;

  const formBgClass = !result
    ? "bg-neutral-900/90"
    : isDiabetic
      ? "bg-[radial-gradient(circle_at_center,_rgba(127,29,29,0.95)_0%,_rgba(153,27,27,0.82)_28%,_rgba(69,10,10,0.9)_55%,_rgba(17,24,39,0.98)_100%)]"
      : "bg-[radial-gradient(circle_at_center,_rgba(20,83,45,0.95)_0%,_rgba(22,101,52,0.82)_28%,_rgba(6,95,70,0.9)_55%,_rgba(17,24,39,0.98)_100%)]";

  const statusText = !result ? "diabetis Risk Estimator" : isDiabetic ? "Diabetic" : "Not diabetic ";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const bmiValue = Number(bmi);
    const hba1cValue = Number(HbA1c_level);
    const glucoseValue = Number(blood_glucose_level);

    if (bmiValue < 10.01 || bmiValue > 95.69) {
      setError("BMI must be between 10.01 and 95.69.");
      return;
    }

    if (hba1cValue < 3.5 || hba1cValue > 9) {
      setError("HbA1c level must be between 3.5 and 9.");
      return;
    }

    if (glucoseValue < 80 || glucoseValue > 300) {
      setError("Blood glucose level must be between 80 and 300.");
      return;
    }

    if (!HbA1c_level || !blood_glucose_level || !age || !bmi) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        HbA1c_level,
        blood_glucose_level,
        age,
        bmi,
        gender,
        smoking_history: smokingHistory,
        hypertension: hypertension === "yes" ? 1 : 0,
        heart_disease: heartDisease === "yes" ? 1 : 0,
      };

      const response = await fetch(`https://diabetesbackend-production.up.railway.app/predict_diabetes`, {
        method: "POST",
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_AUTH_KEY,
          "Content-Type": "application/json",
          model,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to generate prediction.");
        return;
      }

      setResult(data);
      const pred = Number(data.prediction ?? data.prediction_value ?? data.pred ?? 1);
      setFlashState(pred === 0 ? "green" : "red");
      setTimeout(() => setFlashState(null), 1400);
    } catch (err) {
      console.error("Prediction error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative w-full mt-20 max-w-lg overflow-hidden rounded-3xl border border-white/10 ${formBgClass} shadow-[0_0_80px_rgba(0,0,0,0.45)] backdrop-blur-xl p-8 md:p-10 space-y-5 transition-all duration-700 ease-out`}
    >
      <div
        className={`pointer-events-none absolute inset-0 transition-all duration-700 ${
          flashState === "green"
            ? "animate-[flashGreen_1.4s_ease-out_forwards]"
            : flashState === "red"
              ? "animate-[flashRed_1.4s_ease-out_forwards]"
              : "opacity-0"
        }`}
      />
      <div className="absolute inset-0 bg-white/5 pointer-events-none" />
      <div className="relative z-10">
        <div className="text-center mb-6">
          <div className="text-sm uppercase tracking-[0.35em] text-white/60 mb-2">
            {result ? "Prediction result" : "Health check"}
          </div>
          <h2 className={`text-3xl font-black ${isDiabetic ? "text-red-300" : result ? "text-green-300" : "text-teal-300"}`}>
            {statusText}
          </h2>
          <p className="mt-2 text-sm text-white/65">
            Enter your details to estimate the diabetis risk.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-white/75">
              HbA1c Level
            </label>
            <input
              type="text"
              name="HbA1c_level"
              placeholder="Enter HbA1c level"
              value={HbA1c_level}
              onChange={(e) => setHbA1c_level(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white placeholder:text-white/35 outline-none ring-0 transition focus:border-teal-400/70 focus:bg-black/35"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-white/75">
              Blood Glucose Level
            </label>
            <input
              type="text"
              name="blood_glucose_level"
              placeholder="Enter blood glucose level"
              value={blood_glucose_level}
              onChange={(e) => setBlood_glucose_level(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-teal-400/70 focus:bg-black/35"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-white/75">
              Age
            </label>
            <input
              type="number"
              name="age"
              placeholder="Enter age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-teal-400/70 focus:bg-black/35"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-white/75">
              BMI
            </label>
            <input
              type="number"
              step="0.1"
              name="bmi"
              placeholder="Enter BMI"
              value={bmi}
              onChange={(e) => setBmi(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-teal-400/70 focus:bg-black/35"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/75">
              Gender
            </label>
            <div className="flex flex-wrap gap-3">
              {["Male", "Female", "Other"].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/80"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={gender === option}
                    onChange={(e) => setGender(e.target.value)}
                    className="accent-teal-500"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-white/75">
              Smoking History
            </label>
            <select
              value={smokingHistory}
              onChange={(e) => setSmokingHistory(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition focus:border-teal-400/70 focus:bg-black/35"
            >
              {["never", "No Info", "former", "not current", "current", "ever"].map(
                (option) => (
                  <option key={option} value={option} className="bg-neutral-900">
                    {option}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/75">
              Hypertension
            </label>
            <div className="flex gap-3">
              {["yes", "no"].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/80"
                >
                  <input
                    type="radio"
                    name="hypertension"
                    value={option}
                    checked={hypertension === option}
                    onChange={(e) => setHypertension(e.target.value)}
                    className="accent-teal-500"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/75">
              Heart Disease
            </label>
            <div className="flex gap-3">
              {["yes", "no"].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/80"
                >
                  <input
                    type="radio"
                    name="heart_disease"
                    value={option}
                    checked={heartDisease === option}
                    onChange={(e) => setHeartDisease(e.target.value)}
                    className="accent-teal-500"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

  
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-white text-neutral-950 py-3 font-bold transition hover:scale-[1.01] hover:bg-teal-100 disabled:opacity-50"
          >
            {loading ? "Predicting..." : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
}

function PimaForm() {
  const [pregnancies, setPregnancies] = useState("");
  const [glucose, setGlucose] = useState("");
  const [insulin, setInsulin] = useState("");
  const [bmi, setBmi] = useState("");
  const [dpf, setDpf] = useState("");
  const [age, setAge] = useState("");
  const [model, setModel] = useState("Balanced");
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [flashState, setFlashState] = useState(null);

  const predictionValue =
    result?.prediction ?? result?.prediction_value ?? result?.pred ?? null;

  const isDiabetic = predictionValue !== null && Number(predictionValue) !== 0;

  const formBgClass = !result
    ? "bg-neutral-900/90"
    : isDiabetic
      ? "bg-[radial-gradient(circle_at_center,_rgba(127,29,29,0.95)_0%,_rgba(153,27,27,0.82)_28%,_rgba(69,10,10,0.9)_55%,_rgba(17,24,39,0.98)_100%)]"
      : "bg-[radial-gradient(circle_at_center,_rgba(20,83,45,0.95)_0%,_rgba(22,101,52,0.82)_28%,_rgba(6,95,70,0.9)_55%,_rgba(17,24,39,0.98)_100%)]";

  const statusText = !result ? "PIMA Risk Estimator" : isDiabetic ? "Diabetic" : "Not diabetic ";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const pregnanciesValue = Number(pregnancies);
    const glucoseValue = Number(glucose);
    const insulinValue = Number(insulin);
    const bmiValue = Number(bmi);
    const dpfValue = Number(dpf);
    const ageValue = Number(age);

    if (!pregnancies || !glucose || !insulin || !bmi || !dpf || !age) {
      setError("Please fill in all fields.");
      return;
    }

    if (pregnanciesValue < 0 || pregnanciesValue > 17) {
      setError("Pregnancies must be between 0 and 17.");
      return;
    }

    if (glucoseValue < 68 || glucoseValue > 196) {
      setError("Glucose must be between 68 and 196.");
      return;
    }

    if (insulinValue < 0 || insulinValue > 846) {
      setError("Insulin must be between 0 and 846.");
      return;
    }

    if (bmiValue < 19.5 || bmiValue > 50) {
      setError("BMI must be between 19.5 and 50.");
      return;
    }

    if (dpfValue < 0.078 || dpfValue > 2.288) {
      setError("Diabetes Pedigree Function must be between 0.078 and 2.288.");
      return;
    }

    if (ageValue < 21 || ageValue > 81) {
      setError("Age must be between 21 and 81.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        Pregnancies: pregnanciesValue,
        Glucose: glucoseValue,
        Insulin: insulinValue,
        BMI: bmiValue,
        DiabetesPedigreeFunction: dpfValue,
        Age: ageValue,
      };

      const response = await fetch(`https://diabetesbackend-production.up.railway.app/predict_diabetes_pima`, {
        method: "POST",
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_AUTH_KEY,
          "Content-Type": "application/json",
          model,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to generate prediction.");
        return;
      }

      setResult(data);
      const pred = Number(data.prediction ?? data.prediction_value ?? data.pred ?? 1);
      setFlashState(pred === 0 ? "green" : "red");
      setTimeout(() => setFlashState(null), 1400);
    } catch (err) {
      console.error("Prediction error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 ${formBgClass} shadow-[0_0_80px_rgba(0,0,0,0.45)] backdrop-blur-xl p-8 md:p-10 space-y-5 transition-all duration-700 ease-out`}
    >
      <div
        className={`pointer-events-none absolute inset-0 transition-all duration-700 ${
          flashState === "green"
            ? "animate-[flashGreen_1.4s_ease-out_forwards]"
            : flashState === "red"
              ? "animate-[flashRed_1.4s_ease-out_forwards]"
              : "opacity-0"
        }`}
      />
      <div className="absolute inset-0 bg-white/5 pointer-events-none" />
      <div className="relative z-10">
        <div className="text-center mb-6">
          <div className="text-sm uppercase tracking-[0.35em] text-white/60 mb-2">
            {result ? "Prediction result" : "Health check"}
          </div>
          <h2 className={`text-3xl font-black ${isDiabetic ? "text-red-300" : result ? "text-green-300" : "text-teal-300"}`}>
            {statusText}
          </h2>
          <p className="mt-2 text-sm text-white/65">
            Enter your details to estimate the diabetis risk (PIMA dataset model).
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-white/75">
              Pregnancies
            </label>
            <input
              type="number"
              name="Pregnancies"
              placeholder="0 - 17"
              value={pregnancies}
              onChange={(e) => setPregnancies(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-teal-400/70 focus:bg-black/35"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-white/75">
              Glucose
            </label>
            <input
              type="number"
              name="Glucose"
              placeholder="68 - 196"
              value={glucose}
              onChange={(e) => setGlucose(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-teal-400/70 focus:bg-black/35"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-white/75">
              Insulin
            </label>
            <input
              type="number"
              name="Insulin"
              placeholder="0 - 846"
              value={insulin}
              onChange={(e) => setInsulin(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-teal-400/70 focus:bg-black/35"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-white/75">
              BMI
            </label>
            <input
              type="number"
              step="0.1"
              name="BMI"
              placeholder="19.5 - 50"
              value={bmi}
              onChange={(e) => setBmi(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-teal-400/70 focus:bg-black/35"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-white/75">
              Diabetes Pedigree Function
            </label>
            <input
              type="number"
              step="0.001"
              name="DiabetesPedigreeFunction"
              placeholder="0.078 - 2.288"
              value={dpf}
              onChange={(e) => setDpf(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-teal-400/70 focus:bg-black/35"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-white/75">
              Age
            </label>
            <input
              type="number"
              name="Age"
              placeholder="21 - 81"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-teal-400/70 focus:bg-black/35"
            />
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-white text-neutral-950 py-3 font-bold transition hover:scale-[1.01] hover:bg-teal-100 disabled:opacity-50"
          >
            {loading ? "Predicting..." : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("standard");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_#111827_0%,_#030712_55%,_#000000_100%)] px-4 py-10 gap-6">
      {/* <div className="flex gap-2 rounded-full border mt-8 border-white/10 bg-black/25 p-1 backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setActiveTab("standard")}
          className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
            activeTab === "standard"
              ? "bg-teal-500 text-neutral-950"
              : "text-white/60 hover:text-white/90"
          }`}
        >
          Standard
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pima")}
          className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
            activeTab === "pima"
              ? "bg-teal-500 text-neutral-950"
              : "text-white/60 hover:text-white/90"
          }`}
        >
          PIMA
        </button>
      </div> */}

      {activeTab === "Pima" ? <StandardForm /> : <PimaForm />}

      <style jsx global>{`
        @keyframes flashGreen {
          0% {
            background-color: rgba(34, 197, 94, 0.55);
          }
          100% {
            background-color: rgba(34, 197, 94, 0);
          }
        }
        @keyframes flashRed {
          0% {
            background-color: rgba(239, 68, 68, 0.55);
          }
          100% {
            background-color: rgba(239, 68, 68, 0);
          }
        }
      `}</style>
    </div>
  );
}