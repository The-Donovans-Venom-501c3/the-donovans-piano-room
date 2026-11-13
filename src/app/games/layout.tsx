import React from 'react';
import GameShell from './GameShell';

const GameLayout = ({ children }: {
    children: React.ReactNode;
}) => {
    return <GameShell>{children}</GameShell>;
}

export default GameLayout;