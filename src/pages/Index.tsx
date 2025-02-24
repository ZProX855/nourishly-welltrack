
import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [selectedTab, setSelectedTab] = useState("food");

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <Card className="wellness-card">
          <h2 className="text-xl font-semibold mb-4 text-wellness-700">
            Track Your Nutrition
          </h2>
          <div className="space-y-4">
            <div className="wellness-input flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search for food..."
                className="w-full bg-transparent outline-none"
              />
            </div>
            <button className="wellness-button w-full">
              Add Food
            </button>
          </div>
        </Card>

        <Card className="wellness-card">
          <h2 className="text-xl font-semibold mb-4 text-wellness-700">
            AI Assistant
          </h2>
          <div className="h-[400px] flex flex-col">
            <div className="flex-1 bg-wellness-50/50 rounded-lg p-4 mb-4">
              {/* Chat messages will go here */}
            </div>
            <div className="wellness-input flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask me about nutrition..."
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
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
