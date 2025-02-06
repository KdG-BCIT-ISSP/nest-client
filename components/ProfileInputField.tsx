import { ProfileDataType } from "@/types/ProfileDataType";
import { useState } from "react";

const REGION_VALUES = [
  { value: "", label: "Select a region" },
  { value: "north-america", label: "North America" },
  { value: "europe", label: "Europe" },
  { value: "south-america", label: "South America" },
];

export default function ProfileInputField({
  username,
  email,
  region,
}: ProfileDataType) {
  const [inputUsername, setInputUsername] = useState(username);
  const [inputRegion, setInputRegion] = useState(region);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputUsername(event.target.value);
  };

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInputRegion(event.target.value);
  };

  return (
    <div className="bg-white border border-2 rounded-md  relative m-10">
      <div className="p-6 space-y-6">
        <form action="#">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="product-name"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Username
              </label>
              <input
                type="text"
                name="product-name"
                id="product-name"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                value={inputUsername}
                onChange={handleUsernameChange}
                required
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="category"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Email
              </label>
              <input
                type="text"
                name="category"
                id="category"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                value={email}
                readOnly
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="brand"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Region
              </label>
              <select
                name="region"
                id="region"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                value={inputRegion}
                onChange={handleRegionChange}
              >
                {REGION_VALUES.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </div>

      <div className="p-6 border-t border-gray-200 flex justify-end">
        <button
          className="text-white bg-secondary hover:bg-tertiary focus:ring-4 focus:ring-cyan-200 font-medium rounded-md text-sm px-5 py-2.5 text-center"
          type="submit"
        >
          Save all
        </button>
      </div>
    </div>
  );
}
