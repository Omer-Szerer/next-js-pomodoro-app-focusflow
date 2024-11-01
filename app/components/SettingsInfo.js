'use client';
import React from 'react';

export default function SettingsInfo() {
  return (
    <form>
      <table>
        <tbody>
          <tr>
            <td>Work duration:</td>
            <td>
              <input
                name="workDuration"
                type="number"
                min="15"
                max="60"
                defaultValue="25"
                onInput={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (value > 60) e.target.value = 60;
                  else if (value < 25) e.target.value = 25;
                }}
              />
            </td>
          </tr>
          <tr>
            <td>Short break duration:</td>
            <td>
              <input
                name="shortBreakDuration"
                type="number"
                min="5"
                max="15"
                defaultValue="5"
                onInput={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (value > 15) e.target.value = 15;
                  else if (value < 5) e.target.value = 5;
                }}
              />
            </td>
          </tr>
          <tr>
            <td>Long break duration:</td>
            <td>
              <input
                name="longBreakDuration"
                type="number"
                min="20"
                max="45"
                defaultValue="20"
                onInput={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (value > 45) e.target.value = 45;
                  else if (value < 20) e.target.value = 20;
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
}
