import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart } from "lucide-react";
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
      <div className="space-y-6 mt-4">
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

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Heart className="w-6 h-6 text-wellness-500" />
          <h1 className="text-2xl font-semibold text-wellness-700">
            Compare the nutritional value of any two foods!
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="wellness-card">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 rounded-lg bg-wellness-100 text-wellness-700">
                Manual Input
              </div>
              <Select value={food1} onValueChange={setFood1}>
                <SelectTrigger className="wellness-input">
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
                  className="wellness-input"
                />
                <span className="text-wellness-600">grams</span>
              </div>
              {food1 && <NutritionalProgress foodId={food1} weight={weight1} />}
            </div>
          </Card>

          <Card className="wellness-card">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 rounded-lg bg-wellness-100 text-wellness-700">
                Manual Input
              </div>
              <Select value={food2} onValueChange={setFood2}>
                <SelectTrigger className="wellness-input">
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
                  className="wellness-input"
                />
                <span className="text-wellness-600">grams</span>
              </div>
              {food2 && <NutritionalProgress foodId={food2} weight={weight2} />}
            </div>
          </Card>

          <Card className="wellness-card">
            <h2 className="text-xl font-semibold mb-4 text-wellness-700">
              AI Assistant
            </h2>
            <div className="h-[400px] flex flex-col">
              <div className="flex-1 bg-wellness-50/50 rounded-lg p-4 mb-4 overflow-y-auto">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-start gap-2">
                    <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[80%]">
                      Hi! How can I help you with your nutrition today?
                    </div>
                  </div>
                  {/* User messages would appear here with bg-wellness-100 and aligned right */}
                </div>
              </div>
              <div className="wellness-input flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full bg-transparent outline-none"
                />
                <button className="wellness-button">
                  Send
                </button>
              </div>
            </div>
          </Card>

          <Card className="wellness-card md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-wellness-700">
              Meal Recognition
            </h2>
            <div className="border-2 border-dashed border-wellness-200 rounded-lg p-8 text-center">
              <p className="text-wellness-600">
                Drop an image here or click to upload
              </p>
              <button className="wellness-button mt-4">
                Upload Image
              </button>
            </div>
            <div className="mt-4">
              {/* Nutritional table for recognized meal would appear here using the same table component */}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
