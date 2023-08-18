import React, { createContext, useState } from 'react'
import { EditorState } from 'draft-js';

export const ProjectDataContext = createContext();
export const ReturnDataContext = createContext();

export const ProjectDataProvider = ({ children }) => {
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    catch_copies: [''],
    goal_amount: '',
    start_date: '',
    end_date: '',
    project_images: [''],
    description: '',
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [apiImageFiles, setApiImageFiles] = useState([]);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [published, setPublished] = useState(false);

  return (
    <ProjectDataContext.Provider
      value={{
        projectFormData,
        setProjectFormData,
        imagePreviews,
        setImagePreviews,
        apiImageFiles,
        setApiImageFiles,
        published,
        setPublished,
        editorState,
        setEditorState,
      }}
    >
      {children}
    </ProjectDataContext.Provider>
  );
};

export const ReturnDataProvider = ({ children }) => {
  const [returnFormData, setReturnFormData] = useState({
    returns: [
      {
        name: '',
        description: '',
        price: '',
        stock_count: ''
      }
    ]
  });
  const [returnImagePreviews, setReturnImagePreviews] = useState([]);
  const [apiReturnImageFiles, setAipReturnImageFiles] = useState([]);

  return (
    <ReturnDataContext.Provider
      value={{
        returnFormData,
        setReturnFormData,
        apiReturnImageFiles,
        setAipReturnImageFiles,
        returnImagePreviews,
        setReturnImagePreviews
      }}
    >
      {children}
    </ReturnDataContext.Provider>
  );
}
