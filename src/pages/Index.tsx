
import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  // Placeholder data - would be replaced with actual API data
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

  const NutritionalTable = ({ foodId, weight }: { foodId: string; weight: string }) => {
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Nutrient</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Calories</TableCell>
            <TableCell>{info.calories} kcal</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Protein</TableCell>
            <TableCell>{info.protein}g</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Carbohydrates</TableCell>
            <TableCell>{info.carbs}g</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Fat</TableCell>
            <TableCell>{info.fat}g</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Fiber</TableCell>
            <TableCell>{info.fiber}g</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <Card className="wellness-card">
          <h2 className="text-xl font-semibold mb-4 text-wellness-700">
            Compare Foods
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
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
              <Input
                type="number"
                value={weight1}
                onChange={(e) => setWeight1(e.target.value)}
                placeholder="Weight in grams"
                className="wellness-input"
              />
              {food1 && <NutritionalTable foodId={food1} weight={weight1} />}
            </div>
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
    </Layout>
  );
};

export default Index;
