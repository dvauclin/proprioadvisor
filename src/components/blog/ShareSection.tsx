
import React from 'react';

const ShareSection: React.FC = () => {
  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Partager cet article</h3>
        </div>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-500 hover:text-gray-900">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.77,7.46H14.5V5.9c0-.86.52-1.06,0.88-1.06h3.03V0.47h-4.15c-4.14,0-4.73,3.3-4.73,5.41v1.58H8.38v4.13h1.15V24h4.98V11.59h3.36L18.77,7.46z"></path>
            </svg>
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-900">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953,4.57a10,10,0,0,1-2.825.775,4.958,4.958,0,0,0,2.163-2.723,10.1,10.1,0,0,1-3.127,1.184A4.92,4.92,0,0,0,11.78,9.29,13.909,13.909,0,0,1,1.64,3.162,4.822,4.822,0,0,0-.666,5.637,4.921,4.921,0,0,0,3.19,9.936,4.9,4.9,0,0,1,.975,9.313v.06A4.923,4.923,0,0,0,4.9,14.2a5,5,0,0,1-2.212.085,4.936,4.936,0,0,0,4.6,3.417,9.867,9.867,0,0,1-6.1,2.1A10.114,10.114,0,0,1,0,19.744,14,14,0,0,0,7.548,22c9.054,0,14-7.5,14-14,0-.21,0-.42-.015-.63A9.935,9.935,0,0,0,24,4.59Z"></path>
            </svg>
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-900">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19,3H5C3.895,3,3,3.895,3,5v14c0,1.105,0.895,2,2,2h14c1.105,0,2-0.895,2-2V5C21,3.895,20.105,3,19,3z M9,17H6.477v-7H9V17z M7.694,8.717c-0.771,0-1.286-0.514-1.286-1.2s0.514-1.2,1.371-1.2c0.771,0,1.286,0.514,1.286,1.2S8.551,8.717,7.694,8.717z M18,17h-2.442v-3.826c0-1.058-0.651-1.302-0.895-1.302s-1.058,0.163-1.058,1.302c0,0.163,0,3.826,0,3.826h-2.523v-7h2.523v0.977C13.93,10.407,14.581,10,15.802,10C17.023,10,18,10.977,18,13.174V17z"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShareSection;
