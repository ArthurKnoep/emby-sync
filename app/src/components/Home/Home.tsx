import React from 'react';
import { Redirect } from 'react-router-dom';

export function Home() {
    return <Redirect to="/rooms" />
}
