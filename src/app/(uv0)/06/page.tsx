import React from 'react';
import Component02 from '@/components/v0/v0_60/_00/06_life-component';
import { dummyWorks } from '../dummy_db';

const LifeComponentPage = () => {
  return (
    <div>
      <Component02 works={dummyWorks} />
    </div>
  );
};

export default LifeComponentPage;
