import React from 'react';
import constants from '../../constants/Constants';

const HomeScreen = () => {
    return (
        <div className='imagePosition'>
            {constants.WELCOME_TO}
            <br/>
            {constants.RESUME_MANAGEMENT_SYSTEM}
              <br/>
            {constants.ANSI_BYTECODE_LLP}
        </div>
    );
};

export default HomeScreen;