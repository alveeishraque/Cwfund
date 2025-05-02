import { Children, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './component/Root/Root.jsx';
import Home from './component/Home/Home.jsx';
import Login from './component/Login/Login.jsx';
import Register from './component/Register/Register.jsx';
import Authprovider from './provider/Authprovider.jsx';
import Projectlist from './component/Projectlist/Projectlist.jsx';
import InvestorDash from './component/Dashboard/InvestorDash.jsx';
import InvestmentHistory from './component/Dashboard/InvestmentHistory.jsx';
import Investorprofile from './component/Profile/Investorprofile.jsx';
import EntrepreneurDash from './component/Dashboard/EntrepreneurDash.jsx';
import Entrepreneurprofile from './component/Profile/Entrepreneurprofile.jsx';
import Addproject from './component/Projectlist/Addproject.jsx';
import Project from './component/Projectlist/Project.jsx';
import View from './component/Projectlist/View.jsx';
import ViewEntroProject from './component/Projectlist/ViewEntroProject.jsx';
import StaffDash from './component/Dashboard/StaffDash.jsx';
import InvestorUpdate from './component/Profile/InvestorUpdate.jsx';
import EntrepreneurUpdate from './component/Profile/EntrepreneurUpdate.jsx';
import EditProject from './component/Projectlist/EditProject.jsx';
import Notification from './component/Notification/Notification.jsx';
import ViewComments from './component/Comment/ViewComments.jsx';
import Wallet from './component/Wallet/Wallet.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/projectlist", element: <Projectlist /> },
      { path: "/staff-dashboard", element: <StaffDash /> },
      { path: "/investor-dashboard", element: <InvestorDash /> },
      { path: "/investments/history", element: <InvestmentHistory /> },
      { path: "/investorprofile", element: <Investorprofile /> },
      { path: "/investor-edit-profile", element: <InvestorUpdate /> },
      { path: "/entrepreneur-dashboard", element: <EntrepreneurDash /> },
      { path: "/entrepreneurprofile", element: <Entrepreneurprofile /> },
      { path: "/entrepreneur-edit-profile", element: <EntrepreneurUpdate /> },
      { path: "/addproject", element: <Addproject /> },
      { path: "/project", element: <Project /> },
      { path: "/view/:id", element: <View />,
        loader: ({params}) => fetch(`http://localhost:3000/create-project/${params.id}`)
      },
      // view comments
      { 
        path: "/viewcomments/:id", 
        element: <ViewComments />, 
        loader: ({ params }) => fetch(`http://localhost:3000/api/comments/${params.id}`)
      },
      { path: "/entroprojectview/:id", element: <ViewEntroProject />,
        loader: ({params}) => fetch(`http://localhost:3000/edit-project/${params.id}`)
      },
      { path: "/edit-project/:id", element: <EditProject /> },
      { path: "/notification", element: <Notification></Notification> },
      { path: "/wallet", element: <Wallet></Wallet> },

    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Authprovider>
      <RouterProvider router={router} />
    </Authprovider>
  </StrictMode>
)
