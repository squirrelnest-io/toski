import React from "react";
import { useLoaderData } from "react-router-dom";
import { Flex, Heading, Tag, TagLabel, TagRightIcon, Text } from "@chakra-ui/react";

import { AppState } from "../../redux/rootReducer";
import { useSelector } from "react-redux";
import { StatsSelectors } from "../../redux/stats/statsSelectors";
import { Loading } from "../Loading";
import { commanderList } from "../../services/commanderList";
import { MatchDisplayPlayer } from "./types/MatchDisplayPlayer";
import { MatchPlayerCard } from "./MatchPlayerCard";
import { rankDictionary } from "../constants";
import { primaryColor } from "../../themes/acorn";
import { MatchTag, getMatchTags } from "../../logic/matchTags";
import { FiLoader } from "react-icons/fi";
import { MatchTagsGallery } from "../matchTags/MatchTagsGallery";

export async function loader(data: { params: any }) {
    return data.params.matchId;
}

export const MatchDetails = React.memo(function MatchDetails() {
    const matchId = useLoaderData() as string;

    // look up this matchId in the matchHistory
    const match = useSelector((state: AppState) => StatsSelectors.getMatch(state, matchId));

    if (match === undefined) {
        return <Loading text="" />;
    }

    const title = `GAME ${Number(match.id) + 1}`;

    const playerCards = match.players.map((player) => {
        const matchPlayer: MatchDisplayPlayer = {
            name: player.name,
            rank: rankDictionary[player.rank],
            commanders: player.commanders.map((commanderName: string) => {
                return {
                    name: commanderName,
                    id: commanderList[commanderName] ? commanderList[commanderName].id : undefined
                };
            }),
            isWinner: match.winner === player.name
        };

        return <MatchPlayerCard player={matchPlayer} key={"MatchPlayerCard_" + player.name} />;
    });

    const matchTags = getMatchTags(match);
    const tags = (
        <Flex
            alignItems={"center"}
            justifyContent={"center"}
            flexDirection={"column"}
            background={"white"}
            width={"100%"}
            borderWidth={1}
        >
            <MatchTagsGallery match={match} />
        </Flex>
    );

    return (
        <Flex direction="column" justify="center" align="center">
            <Flex direction={"row"} flex={1} marginBottom={8} flexWrap={"wrap"} justify={"center"}>
                {playerCards}
            </Flex>
            <Flex
                direction={"column"}
                justify="center"
                align="center"
                borderTopRadius={"8px"}
                minWidth={"300px"}
                backgroundColor={primaryColor["500"]}
            >
                <Heading size="md" color={"white"} padding={"8px"}>
                    {title}
                </Heading>
                {match.winner ? (
                    <Text
                        alignSelf={"stretch"}
                        borderWidth={1}
                        padding={"8px"}
                        background={"white"}
                    >{`Winner: ${match.winner}`}</Text>
                ) : null}
                {match.numberOfTurns ? (
                    <Text
                        alignSelf={"stretch"}
                        borderWidth={1}
                        padding={"8px"}
                        background={"white"}
                    >{`Number of turns: ${match.numberOfTurns}`}</Text>
                ) : null}
                {match.firstKnockOutTurn ? (
                    <Text
                        alignSelf={"stretch"}
                        borderWidth={1}
                        padding={"8px"}
                        background={"white"}
                    >{`First KO Turn: ${match.firstKnockOutTurn}`}</Text>
                ) : null}
                {match.timeLength ? (
                    <Text
                        alignSelf={"stretch"}
                        borderWidth={1}
                        padding={"8px"}
                        background={"white"}
                    >{`Game Length: ${match.timeLength} minutes`}</Text>
                ) : null}
                {matchTags.length > 0 ? tags : null}
            </Flex>
        </Flex>
    );
});
