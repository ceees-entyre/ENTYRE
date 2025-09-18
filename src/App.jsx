import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styles from './styles/App.module.css';

import Navbar from './components/global/Navbar';
import Footer from './components/global/Footer';

// Page views
import Home from './pages/Home';
import KeyOutputs from './pages/Outputs/KeyOutputs';
import ArticleDetail from './pages/Outputs/OutputDetail';
import PathwayExplorer from './pages/PathwayExplorer';
import DataVisualisation from './pages/DataVisulisation/DataVisualisation';

export default function App() {
  return (
    <Router>
      <div className={styles.appWrapper}>
        <Navbar />

        <main className={styles.mainContent}>
          <div className={styles.pageContainer}>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/key-outputs" element={<KeyOutputs />} />
              <Route path="/outputs/:id" element={<ArticleDetail />} />
              <Route path="/pathway-explorer" element={<PathwayExplorer />} />
              <Route path="/pathway-explorer/*" element={<PathwayExplorer />} />
              <Route path="/data-visualisation/*" element={<DataVisualisation />} />
            </Routes>
          </div>
        </main>

        <Footer />
      </div>
    </Router>
  );
}