import React from "react";
import { Flex } from "@chakra-ui/react";

import { MatchTurnsLineChart } from "./MatchTurnsLineChart";
import { StatsSelectors } from "../../redux/stats/statsSelectors";
import { useSelector } from "react-redux";
import { Loading } from "../Loading";
import { Match } from "../../types/domain/Match";
import { MatchLengthBarChart } from "./MatchLengthBarChart";
import { MatchFrequencyLineChart } from "./MatchFrequencyLineChart";
import { Player } from "../../types/domain/Player";
import { MTG_COLORS } from "../constants";
import { AppState } from "../../redux/rootReducer";
import { MatchPositionWinsBarChart } from "./MatchPositionWinsBarChart";
import { MatchTimeLineChart } from "./MatchTimeLineChart";
import { MatchLengthLineCharts } from "./MatchLengthLineCharts";
import { MatchFirstKoTurnLineChart } from "./MatchFirstKoTurnLineChart";

export const MatchTrends = React.memo(function MatchHistory() {
    const matches = useSelector(StatsSelectors.getMatches);
    const players: Player[] = useSelector((state: AppState) => StatsSelectors.getPlayersByDate(state));

    if (matches === undefined || players === undefined) {
        return <Loading text="" />;
    }

    // cannot directly mutate state, copy to new array first
    const sortedMatches = matches.slice().sort((a: Match, b: Match) => Number(a.id) - Number(b.id));

    // Create a color dictionary to track colors played
    const colorsPlayedDictionary: Record<string, number> = MTG_COLORS.reduce<Record<string, number>>((acc, color) => {
        acc[color.id] = 0;
        return acc;
    }, {});

    // Loop through all players and update dictionary
    for (const player of players) {
        for (const colorID in player.colorProfile) {
            colorsPlayedDictionary[colorID] += player.colorProfile.colors[colorID];
        }
    }
    // Create colors played array
    const colorsPlayedArray: number[] = [];
    for (const colorObj of MTG_COLORS) {
        colorsPlayedArray.push(colorsPlayedDictionary[colorObj.id]);
    }

    return (
        <Flex direction="column" justify="center" align="center">
            <MatchLengthBarChart matches={sortedMatches} />
            <MatchLengthLineCharts matches={sortedMatches} />
            <MatchFirstKoTurnLineChart matches={sortedMatches} />
            <MatchFrequencyLineChart matches={sortedMatches} />
            <MatchPositionWinsBarChart matches={sortedMatches} />
        </Flex>
    );
});
