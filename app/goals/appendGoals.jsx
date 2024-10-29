  import { useState, useEffect } from "react";
  import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
  import Goals from "../goals/goals";
  import PreviousGoals from "../goals/previous-goals";

  const AppendGoals = () => {
    const [activeTab, setActiveTab] = useState("goals");
    const [isLoading, setIsLoading] = useState(true);
    const [goals, setGoals] = useState([]); // State for active goals
    const [previousGoals, setPreviousGoals] = useState([]); // State for previous goals

    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        // Replace with actual fetching logic
        const fetchedGoals = [
          { id: '1', name: 'Goal 1', progress: 0 },
          { id: '2', name: 'Goal 2', progress: 80 },
        ];
        const fetchedPreviousGoals = [];
        setGoals(fetchedGoals);
        setPreviousGoals(fetchedPreviousGoals);
        setIsLoading(false);
      };

      fetchData();
    }, []);

    return (
      <View>
        <View className="flex flex-row border border-[#ffffff20] rounded-lg">
          <TouchableOpacity
            className={`flex-1 py-0 items-center ${activeTab === "goals" ? "" : "bg-transparent"}`}
            onPress={() => setActiveTab("goals")}
          >
            <Text className={`text-[#ffffff51] font-pregular ${activeTab === "goals" ? "text-[#29e120a0] font-pbold" : ""}`}>
              Active
            </Text>
          </TouchableOpacity>
          <View className="border-l border-[#ffffff3d]" />
          <TouchableOpacity
            className={`flex-1 py-0 items-center ${activeTab === "history" ? "" : "bg-transparent"}`}
            onPress={() => setActiveTab("history")}
          >
            <View className="flex flex-row gap-2 justify-center items-center">
              <Text className={`text-[#ffffff51] font-pregular ${activeTab === "history" ? "text-[#ffdd00b7] font-pbold" : ""}`}>
                Completed
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View className="mt-4">
          {isLoading ? (
            <ActivityIndicator size="large" color="#29e120" />
          ) : activeTab === "goals" ? (
            <Goals goals={goals} setGoals={setGoals} previousGoals={previousGoals} setPreviousGoals={setPreviousGoals} />
          ) : (
            <PreviousGoals loading={isLoading} goals={goals} previousGoals={previousGoals || []} />
          )}
        </View>
      </View>
    );
  };

  export default AppendGoals;
