import "bootstrap/dist/css/bootstrap.min.css";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { debounce } from "lodash";
import "./Anime.css";

function Anime() {
  const [animeData, setAnimeData] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [matchingAnime, setMatchingAnime] = useState(0);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");


  const debouncedSearch = debounce((value) => setSearch(value), 100);

  
  const [loader, setLoader] = useState(true);

  const getAnimeDetails = async () => {
    await axios
      .get(
        `${
          process.env.REACT_APP_API_END_POINT
        }?page=${page}&limit=${15}&q=${search}&order_by=favorites&sort=desc`
      )
      .then((res) => {
        console.log("res: ", res);

        setAnimeData(res?.data?.data);
        // setAnimeData([]);
        const totalItems = res?.data?.pagination?.items?.total;
        const totalPages = Math.ceil(totalItems / 15);
        setMatchingAnime(totalItems);

        setTotalPages(totalPages);
        setLoader(false);
      })
      .catch((err) => {
        console.log("err", err);
        setLoader(false);
      });
  };

  useEffect(() => {
    getAnimeDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  useEffect(() => {
    if (inputValue === "") {
      // If the input is cleared, call the search function immediately
      setSearch("");
    } else {
      // Otherwise, debounce the search
      debouncedSearch(inputValue);
    }

    // Cancel the debounce on useEffect cleanup.
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch, inputValue]);

  useEffect(() => {
    if (
      !animeData.some((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    ) {
      setMatchingAnime(false);
    }
  }, [animeData, search]);

  return (
    <>
      <Box className="position-relative image-section">
        <img src={"/assets/Images/2.jpg"} className="custom-img" alt="logo" />
        <Box className="position-absolute search-section">
          <Typography variant="h3">Search Anime Characters</Typography>
          <Box className="container search mt-4">
            <TextField
              id="outlined-basic"
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              value={inputValue}
              variant="outlined"
              fullWidth
              label="Search"
              InputProps={{
                style: {
                  backgroundColor: "white",
                },
              }}
            />
          </Box>
          <Box className="text-white text-center mt-4">
            <Typography variant="h6">
              Total <b>{matchingAnime ? matchingAnime : 0}</b> matching anime
              character found
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box className="container section-main">
        {loader ? (
          <Box className="text-center">
            <CircularProgress />
          </Box>
        ) : (
          <>
            {animeData && animeData.length > 0 ? (
              animeData.some((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
              ) ? (
                animeData.map((item, index) => {
                  return (
                    <>
                      <Card className="card-section">
                        <CardContent className="card-content">
                          <Box className="d-flex justify-content-between align-items-center content-div-main">
                            <Box className="d-flex align-items-center justify-content-between card-left">
                              <Box className="d-flex align-items-center w-100">
                                <Box className="img-div">
                                  <img
                                    src={`${item?.images?.jpg?.image_url}`}
                                    alt="anime"
                                    className="anime-image"
                                  />
                                </Box>
                                <Box className="card-sub-content">
                                  <Box className="">
                                    <Box>
                                      <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="div"
                                      >
                                        {item?.name}
                                      </Typography>
                                    </Box>

                                    <Box>
                                      <Stack
                                        direction="row"
                                        spacing={1}
                                        sx={{ flexWrap: "wrap" }}
                                      >
                                        {item?.nicknames?.map(
                                          (anime, index) => {
                                            return (
                                              <Chip
                                                label={`${anime}`}
                                                color="primary"
                                              />
                                            );
                                          }
                                        )}
                                      </Stack>
                                    </Box>
                                  </Box>

                                  <Box>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      <FavoriteIcon className="favorite-icon" />
                                      <b>{item?.favorites}</b>
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>

                            <Box className="arrow-div">
                              <ArrowForwardIcon
                                sx={{ fontSize: 60, color: "purple" }}
                              />
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </>
                  );
                })
              ) : search ? (
                <Box className="text-center">
                  <Typography variant="h6" component="div">
                    No exact match found for "{search}"!
                  </Typography>
                </Box>
              ) : null
            ) : (
              <Box className="text-center">
                <Typography variant="h6" component="div">
                  No results found!
                </Typography>
              </Box>
            )}

            {animeData &&
              animeData.length > 0 &&
              animeData.some((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
              ) && (
                <Box className="pagination-div">
                  <Stack className="custom-pagination" spacing={2}>
                    <Button
                      variant="outlined"
                      disabled={page === 1}
                      onClick={() => setPage(page > 1 ? page - 1 : page)}
                      sx={{ marginTop: "16px !important" }}
                    >
                      Back
                    </Button>
                    <Button
                      variant="outlined"
                      disabled={page === totalPages}
                      onClick={() =>
                        setPage(page < totalPages ? page + 1 : page)
                      }
                    >
                      Next
                    </Button>
                  </Stack>
                </Box>
              )}
          </>
        )}
      </Box>
    </>
  );
}

export default Anime;
