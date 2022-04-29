import { Tabs } from 'antd';
import Upload from './components/Upload';
import Search from './components/Search';
import './App.css';

const { TabPane } = Tabs;

const App = () => (
  <div className="container mx-auto p-4">
    <Tabs defaultActiveKey="1">
      <TabPane tab="Upload" key="1">
        <Upload />
      </TabPane>
      <TabPane tab="Search" key="2">
        <Search />
      </TabPane>
    </Tabs>
  </div>
);

export default App;
