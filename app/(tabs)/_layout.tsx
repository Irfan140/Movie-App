import { Tabs } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Tabs>
      {/* It hides the index at the top of our screen */}
      <Tabs.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />

      {/* Hides the saved header wrritten at the top of saved screen */}
      <Tabs.Screen
        name="saved"
        options={{ title: "Saved", headerShown: false }}
      />

      <Tabs.Screen
        name="search"
        options={{ title: "Search", headerShown: false }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", headerShown: false }}
      />
    </Tabs>
  );
};

export default _layout;
