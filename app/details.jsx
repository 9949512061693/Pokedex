import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

const colorStyleByType = {
    grass: "#78C850",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    bug: "#A8B820",
    normal: "#A8A878",
    poison: "#A040A0",
    ground: "#E0C068",
    fairy: "#EE99AC",
    fighting: "#C03028",
    psychic: "#F85888",
    rock: "#B8A038",
    ghost: "#705898",
    ice: "#98D8D8",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    flying: "#A890F0",
};

export default function Details() {
    const { name } = useLocalSearchParams();
    const router = useRouter();

    const [pokemon, setPokemon] = useState(null);
    const [description, setDescription] = useState("");

    useEffect(() => {
        fetchPokemon();
    }, []);

    async function fetchPokemon() {
        try {

            const res = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${name}`
            );
            const data = await res.json();

            const speciesRes = await fetch(data.species.url);
            const speciesData = await speciesRes.json();

            const entry = speciesData.flavor_text_entries.find(
                (e) => e.language.name === "en"
            );

            setDescription(entry?.flavor_text || "");

            setPokemon({
                id: data.id,
                name: data.name,
                image: data.sprites.other["official-artwork"].front_default,
                types: data.types,
                stats: data.stats,
            });
        } catch (error) {
            console.log(error);
        }
    }

    if (!pokemon) {
        return <Text style={{ color: 'black', fontSize: 28, fontWeight: 'bold', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>Loading...</Text>;
    }

    const typeName = pokemon.types?.[0]?.type?.name;
    const bgColor = colorStyleByType[typeName] || "#ccc";

    const getStatColor = (value) => {
        if (value < 50) return "#EF4444";
        if (value < 80) return "#F59E0B";
        return "#10B981";
    };

    return (
        <ScrollView style={{ backgroundColor: "#F8FAFC" }}>
            <View style={styles.container}>
                <View>
                    <Text style={styles.title}>{pokemon.name}</Text>
                    <Text style={styles.id}>#{pokemon.id}</Text>
                </View>

                <View
                    style={[
                        styles.imageCard,
                        { backgroundColor: bgColor + "50" },
                    ]}
                >
                    <Image
                        source={{ uri: pokemon.image }}
                        style={styles.image}
                    />
                </View>
                <View style={styles.typeContainer}>
                    {pokemon.types.map((t, i) => (
                        <View
                            key={i}
                            style={[
                                styles.typeChip,
                                {
                                    backgroundColor:
                                        colorStyleByType[t.type.name] || "#ccc",
                                },
                            ]}
                        >
                            <Text style={styles.typeText}>
                                {t.type.name.toUpperCase()}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={styles.descriptionBox}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>
                        {description.replace(/\n|\f/g, " ")}
                    </Text>
                </View>

                <View style={{ marginTop: 20 }}>
                    <Text style={styles.sectionTitle}>Stats</Text>

                    {pokemon.stats.map((stat, index) => {
                        const value = stat.base_stat;

                        return (
                            <View key={index} style={styles.statRow}>

                                <View style={styles.statHeader}>
                                    <Text style={styles.statName}>
                                        {stat.stat.name.toUpperCase()}
                                    </Text>
                                    <Text style={styles.statValue}>
                                        {value}
                                    </Text>
                                </View>

                                <View style={styles.progressBar}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            {
                                                width: `${Math.min(value, 100)}%`,
                                                backgroundColor: getStatColor(value),
                                            },
                                        ]}
                                    />
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },

    title: {
        fontSize: 22,
        fontWeight: "600",
        color: "#111827",
        textAlign: 'center'
    },

    id: {
        fontSize: 14,
        color: "#6B7280",
        textAlign: 'center'
    },

    imageCard: {
        marginTop: 20,
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
    },

    image: {
        width: 200,
        height: 200,
    },

    typeContainer: {
        flexDirection: "row",
        gap: 10,
        marginTop: 15,
        justifyContent: "center",
    },

    typeChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },

    typeText: {
        fontSize: 12,
        color: "#fff",
        fontWeight: "600",
    },

    descriptionBox: {
        marginTop: 20,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
    },

    description: {
        fontSize: 14,
        color: "#374151",
        lineHeight: 20,
    },

    statRow: {
        marginBottom: 12,
    },

    statHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    statName: {
        fontSize: 12,
        color: "#6B7280",
    },

    statValue: {
        fontSize: 12,
        fontWeight: "600",
    },

    progressBar: {
        height: 8,
        backgroundColor: "#E5E7EB",
        borderRadius: 10,
        marginTop: 4,
        overflow: "hidden",
    },

    progressFill: {
        height: "100%",
        borderRadius: 10,
    },
});