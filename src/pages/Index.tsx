import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Scale, Target, Users, Route, Brain, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProgressBar } from "@/components/ui/progress-bar";

interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

const Index = () => {
  const [food1, setFood1] = useState("");
  const [food2, setFood2] = useState("");
  const [weight1, setWeight1] = useState("100");
  const [weight2, setWeight2] = useState("100");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>("");

  const foodOptions = [
    { value: "chicken", label: "Chicken Breast", category: "Protein" },
    { value: "rice", label: "Brown Rice", category: "Carbs" },
    { value: "avocado", label: "Avocado", category: "Fats" },
    { value: "apple", label: "Apple", category: "Fruits" },
    { value: "yogurt", label: "Greek Yogurt", category: "Dairy" },
  ];

  const mockNutritionalInfo: Record<string, NutritionalInfo> = {
    chicken: { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
    rice: { calories: 111, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8 },
    avocado: { calories: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7 },
    apple: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 },
    yogurt: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0 },
  };

  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);
      const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);
      setBmi(Math.round(calculatedBMI * 10) / 10);

      if (calculatedBMI < 18.5) {
        setBmiCategory("Underweight");
      } else if (calculatedBMI < 25) {
        setBmiCategory("Normal weight");
      } else if (calculatedBMI < 30) {
        setBmiCategory("Overweight");
      } else {
        setBmiCategory("Obese");
      }
    }
  };

  const NutritionalProgress = ({ foodId, weight }: { foodId: string; weight: string }) => {
    if (!foodId) return null;
    const baseInfo = mockNutritionalInfo[foodId];
    if (!baseInfo) return null;

    const multiplier = parseFloat(weight) / 100;
    const info = {
      calories: Math.round(baseInfo.calories * multiplier * 10) / 10,
      protein: Math.round(baseInfo.protein * multiplier * 10) / 10,
      carbs: Math.round(baseInfo.carbs * multiplier * 10) / 10,
      fat: Math.round(baseInfo.fat * multiplier * 10) / 10,
      fiber: Math.round(baseInfo.fiber * multiplier * 10) / 10,
    };

    return (
      <div className="space-y-6 mt-4 animate-fade-in">
        <h3 className="text-lg font-medium text-wellness-700">Enter a food</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-wellness-700">Calories</span>
            <span className="text-wellness-600">{info.calories} kcal</span>
          </div>
          <ProgressBar value={info.protein} max={50} label="Protein" className="bg-wellness-100" />
          <ProgressBar value={info.carbs} max={100} label="Carbs" className="bg-wellness-100" />
          <ProgressBar value={info.fat} max={40} label="Fat" className="bg-wellness-100" />
          <ProgressBar value={info.fiber} max={30} label="Fiber" className="bg-wellness-100" />
        </div>
      </div>
    );
  };

  const bodyTypes = [
    {
      type: "Ectomorph",
      description: "Naturally lean and struggles to gain weight",
      goals: ["Muscle gain", "Strength building", "Healthy weight gain"],
      tips: ["Increase caloric intake", "Focus on compound exercises", "Frequent meals"],
    },
    {
      type: "Mesomorph",
      description: "Athletic build with moderate weight gain/loss ability",
      goals: ["Muscle definition", "Athletic performance", "Body recomposition"],
      tips: ["Balanced macronutrients", "Mixed training approach", "Regular exercise"],
    },
    {
      type: "Endomorph",
      description: "Tends to gain weight more easily",
      goals: ["Fat loss", "Muscle maintenance", "Cardiovascular health"],
      tips: ["Caloric deficit", "Regular cardio", "High protein intake"],
    },
  ];

  const [selectedBodyType, setSelectedBodyType] = useState("");

  const generalTips = [
    {
      icon: <Target className="w-6 h-6 text-wellness-600" />,
      title: "Set Clear Goals",
      description: "Define specific, measurable, and time-bound objectives",
    },
    {
      icon: <Users className="w-6 h-6 text-wellness-600" />,
      title: "Find Support",
      description: "Connect with like-minded individuals or get a workout buddy",
    },
    {
      icon: <Route className="w-6 h-6 text-wellness-600" />,
      title: "Track Progress",
      description: "Monitor your journey and celebrate small victories",
    },
    {
      icon: <Brain className="w-6 h-6 text-wellness-600" />,
      title: "Stay Consistent",
      description: "Build healthy habits through regular practice",
    },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-semibold text-wellness-700 text-center mb-8 hover:scale-105 transition-all duration-300">
          Compare the nutritional value of any two foods!
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="wellness-card transform hover:scale-102 transition-all duration-300 bg-white/80">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 rounded-lg bg-wellness-100 text-wellness-700 hover:bg-wellness-200 transition-colors">
                Manual Input
              </div>
              <Select value={food1} onValueChange={setFood1}>
                <SelectTrigger className="wellness-input hover:border-wellness-500 transition-colors">
                  <SelectValue placeholder="Select first food" />
                </SelectTrigger>
                <SelectContent>
                  {foodOptions.map((food) => (
                    <SelectItem key={food.value} value={food.value}>
                      {food.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  value={weight1}
                  onChange={(e) => setWeight1(e.target.value)}
                  className="wellness-input hover:border-wellness-500 transition-colors"
                />
                <span className="text-wellness-600">grams</span>
              </div>
              {food1 && <NutritionalProgress foodId={food1} weight={weight1} />}
            </div>
          </Card>

          <Card className="wellness-card transform hover:scale-102 transition-all duration-300 bg-white/80">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 rounded-lg bg-wellness-100 text-wellness-700 hover:bg-wellness-200 transition-colors">
                Manual Input
              </div>
              <Select value={food2} onValueChange={setFood2}>
                <SelectTrigger className="wellness-input hover:border-wellness-500 transition-colors">
                  <SelectValue placeholder="Select second food" />
                </SelectTrigger>
                <SelectContent>
                  {foodOptions.map((food) => (
                    <SelectItem key={food.value} value={food.value}>
                      {food.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  value={weight2}
                  onChange={(e) => setWeight2(e.target.value)}
                  className="wellness-input hover:border-wellness-500 transition-colors"
                />
                <span className="text-wellness-600">grams</span>
              </div>
              {food2 && <NutritionalProgress foodId={food2} weight={weight2} />}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:col-span-2">
            <Card className="wellness-card transform hover:scale-102 transition-all duration-300 bg-white/80">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-wellness-500" />
                  <h2 className="text-xl font-semibold text-wellness-700">BMI Calculator</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-wellness-600 mb-1">Height (cm)</label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="Enter your height"
                      className="wellness-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-wellness-600 mb-1">Weight (kg)</label>
                    <Input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="Enter your weight"
                      className="wellness-input"
                    />
                  </div>
                  <button
                    onClick={calculateBMI}
                    className="wellness-button w-full"
                  >
                    Calculate BMI
                  </button>
                  {bmi !== null && (
                    <div className="mt-4 p-4 rounded-lg bg-wellness-50">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-wellness-700">{bmi}</p>
                        <p className="text-wellness-600">{bmiCategory}</p>
                      </div>
                      <div className="mt-4">
                        <div className="h-2 w-full bg-wellness-100 rounded-full">
                          <div
                            className="h-full bg-wellness-500 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${Math.min((bmi / 40) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-wellness-600">
                          <span>18.5</span>
                          <span>25</span>
                          <span>30</span>
                          <span>40</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <Card className="wellness-card transform hover:scale-102 transition-all duration-300 bg-white/80">
              <h2 className="text-xl font-semibold mb-4 text-wellness-700">
                AI Assistant
              </h2>
              <div className="h-[400px] flex flex-col">
                <div className="flex-1 bg-wellness-50/50 rounded-lg p-4 mb-4 overflow-y-auto">
                  <div className="flex flex-col space-y-4 animate-fade-in">
                    <div className="flex items-start gap-2">
                      <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[80%] hover:shadow-md transition-shadow">
                        Hi! How can I help you with your nutrition today?
                      </div>
                    </div>
                  </div>
                </div>
                <div className="wellness-input flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full bg-transparent outline-none"
                  />
                  <button className="wellness-button hover:bg-wellness-300 transition-colors">
                    Send
                  </button>
                </div>
              </div>
            </Card>
          </div>

          <Card className="wellness-card md:col-span-2 transform hover:scale-102 transition-all duration-300 bg-white/80">
            <h2 className="text-xl font-semibold mb-4 text-wellness-700">
              Meal Recognition
            </h2>
            <div className="border-2 border-dashed border-wellness-200 rounded-lg p-8 text-center hover:border-wellness-300 transition-colors">
              <p className="text-wellness-600">
                Drop an image here or click to upload
              </p>
              <button className="wellness-button mt-4 hover:bg-wellness-300 transition-colors">
                Upload Image
              </button>
            </div>
          </Card>
        </div>

        <div className="mt-16 space-y-12">
          <h2 className="text-2xl font-semibold text-wellness-700 text-center">
            Your Wellness Journey
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {generalTips.map((tip, index) => (
              <Card 
                key={index} 
                className="wellness-card hover:scale-102 transition-all duration-300 bg-white/80"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  {tip.icon}
                  <h3 className="font-semibold text-wellness-700">{tip.title}</h3>
                  <p className="text-wellness-600 text-sm">{tip.description}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-wellness-700 text-center">
              Understand Your Body Type
            </h3>
            
            <div className="flex justify-center space-x-4">
              {bodyTypes.map((type) => (
                <button
                  key={type.type}
                  onClick={() => setSelectedBodyType(type.type)}
                  className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                    selectedBodyType === type.type
                      ? "bg-wellness-200 text-wellness-700 shadow-md"
                      : "bg-wellness-50 text-wellness-600 hover:bg-wellness-100"
                  }`}
                >
                  {type.type}
                </button>
              ))}
            </div>

            {selectedBodyType && (
              <Card className="wellness-card animate-fade-in bg-white/80">
                {bodyTypes
                  .filter((type) => type.type === selectedBodyType)
                  .map((type) => (
                    <div key={type.type} className="space-y-6">
                      <div className="space-y-2">
                        <h4 className="text-lg font-semibold text-wellness-700">
                          {type.type}
                        </h4>
                        <p className="text-wellness-600">{type.description}</p>
                      </div>

                      <div className="space-y-4">
                        <h5 className="font-medium text-wellness-700">Common Goals:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {type.goals.map((goal, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 text-wellness-600"
                            >
                              <ArrowRight className="w-4 h-4 text-wellness-500" />
                              <span>{goal}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h5 className="font-medium text-wellness-700">
                          Recommended Approach:
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {type.tips.map((tip, index) => (
                            <div
                              key={index}
                              className="bg-wellness-50 p-4 rounded-lg text-wellness-600"
                            >
                              {tip}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
