import ReactDOM from "react-dom/client"

import App from "./App"
import "./styles/global.less"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // 暂时注释掉 StrictMode 以避免 antd-mobile 的 findDOMNode 警告
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
)
