import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { download } from "../assets";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { useSnapshot } from "valtio";
import state from "../store";
import { fadeAnimation, slideAnimation } from "../config/motion";
import { DecalTypes, EditorTabs, FilterTabs } from "../config/constants";
import {
  AIPicker,
  ColorPicker,
  CustomButton,
  FilePicker,
  Tab,
} from "../components";
const Customizer = () => {
  const snap = useSnapshot(state);
  const [file, setFile] = useState("");
  const [aiPropmt, setAiPropmt] = useState("");
  const [generatingImg, setGeneratingImg] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case "aipicker":
        return (
          <AIPicker
            prompt={aiPropmt}
            setPropmt={setAiPropmt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (type) => {
    if (!prompt) return alert("Please enter a prompt");

    try {
      setGeneratingImg(true);

      const response = await fetch("http://localhost:8080/api/v1/dalle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      const data = await response.json();
      if (data.message === "Something went wrong") {
        alert(data.message);
        setGeneratingImg(false);
        setActiveEditorTab("");
      } else {
        handleDecals(type, `data:image/png;base64,${data.photo}`);
      }
    } catch (error) {
      alert(error);
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab("");
    }
  };

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isFullTexture = false;
        state.isLogoTexture = true;
        break;
    }
    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName],
      };
    });
  };
  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];
    state[decalType.stateProperty] = result;
    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  };

  const readFile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result);
      setActiveEditorTab("");
    });
  };
  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10 "
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab, index) => (
                  <Tab
                    key={index}
                    tab={tab}
                    handleClick={() => {
                      if (activeEditorTab == tab.name) {
                        setActiveEditorTab("");
                      } else {
                        setActiveEditorTab(tab.name);
                      }
                    }}
                  />
                ))}
              </div>
              {generateTabContent()}
            </div>
          </motion.div>
          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              title="Go Back"
              type="filled"
              handleClick={() => (state.intro = true)}
              customStyles="w-fit pz-4 py-2.5 font-bold text-sm "
            />
          </motion.div>
          <motion.div
            className="filtertabs-container "
            {...slideAnimation("up")}
          >
            {FilterTabs.map((filter, index) => (
              <Tab
                key={index}
                tab={filter}
                isFilterTab
                isActiveTab={activeFilterTab[filter.name]}
                handleClick={() => handleActiveFilterTab(filter.name)}
              />
            ))}
            <button className="download-btn" onClick={downloadCanvasToImage}>
              <img
                src={download}
                alt="download_image"
                className="w-3/5 h-3/5 object-contain"
              />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
