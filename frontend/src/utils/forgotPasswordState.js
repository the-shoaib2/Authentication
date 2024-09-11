import { createContext, useContext, useReducer } from 'react';

const ForgotPasswordContext = createContext();

const initialState = {
  userFound: false,
  codeVerified: false,
  email: '',
  resetToken: ''
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER_FOUND':
      return { ...state, userFound: true, email: action.payload };
    case 'SET_CODE_VERIFIED':
      return { ...state, codeVerified: true, resetToken: action.payload };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

export const ForgotPasswordProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ForgotPasswordContext.Provider value={{ state, dispatch }}>
      {children}
    </ForgotPasswordContext.Provider>
  );
};

export const useForgotPasswordState = () => useContext(ForgotPasswordContext);
