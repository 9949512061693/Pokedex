import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

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

export default function Index() {
  const [pokemonData, setPokemonData] = useState([]);

  useEffect(() => {
    fetchPokemons();
  }, []);

  async function fetchPokemons() {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100");
      const data = await response.json();
      const detailedPokemonData = await Promise.all(
        data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();

          return {
            name: pokemon.name,
            image: details.sprites.front_default,
            types: details.types,
          };
        })
      );

      setPokemonData(detailedPokemonData);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ gap: 10, padding: 20 }}>
      <Text style={{
        fontSize: 32,
        fontFamily: "Bree Serif",
        fontWeight: '500',
      }}>Pokedex</Text>
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}>
        {pokemonData.map((eachPokemon) => {
          const typeName = eachPokemon.types?.[0]?.type?.name;
          const bgColor = colorStyleByType[typeName];
          const lightColor = ["electric", "fairy", "ice"].includes(typeName);

          return (
            <View style={{ width: "48%", marginBottom: 10 }}>
              <Link
                href={{ pathname: "/details", params: { name: eachPokemon.name } }}
                asChild
              >
                <Pressable
                  style={{
                    backgroundColor: bgColor + "80",
                    padding: 10,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri: eachPokemon.image }}
                    style={{ width: 100, height: 100 }}
                  />

                  <Text style={styles.name}>{eachPokemon.name}</Text>

                  <Text
                    style={{
                      fontSize: 12,
                      color: lightColor ? "#1F2937" : "#F8F9FA",
                      fontWeight: "500",
                    }}
                  >
                    {typeName}
                  </Text>
                </Pressable>
              </Link>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "600",
    fontStyle: 'italic'
  },
});