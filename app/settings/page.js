import React from 'react';
import SettingsInfo from '../components/SettingsInfo';

// import ReactSlider from 'react-slider';

export default function SettingsPage() {
  return (
    <>
      <h1>Settings</h1>
      <SettingsInfo />
      {/* <ReactSlider
        className="slider"
        thumbClassName="thumb"
        trackClassName="track"
        value={45}
        min={1}
        max={120}
      /> */}
    </>
  );
}
