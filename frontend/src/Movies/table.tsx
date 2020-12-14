import React, { FunctionComponent } from "react";
import { Column } from "react-table";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Badge } from "react-bootstrap";

import {
  BasicTable,
  ActionIcon,
  AsyncStateOverlay,
  BooleanIndicator,
} from "../Components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWrench,
  faCheck,
  faBookmark,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons";

interface Props {
  movies: AsyncState<Movie[]>;
  openMovieEditor?: (movie: Movie) => void;
}

function mapStateToProps({ movie }: StoreState) {
  const { movieList } = movie;
  return {
    movies: movieList,
  };
}

const Table: FunctionComponent<Props> = (props) => {
  const { movies, openMovieEditor: onOpenMovieEditor } = props;

  const columns: Column<Movie>[] = React.useMemo<Column<Movie>[]>(
    () => [
      {
        accessor: "monitored",
        Cell: (row) => {
          const monitored = row.value;

          return (
            <FontAwesomeIcon
              icon={monitored ? faBookmark : farBookmark}
            ></FontAwesomeIcon>
          );
        },
      },
      {
        Header: "Name",
        accessor: "title",
        Cell: (row) => {
          const target = `/movies/${row.row.original.radarrId}`;
          return (
            <Link to={target}>
              <span>{row.value}</span>
            </Link>
          );
        },
      },
      {
        Header: "Exist",
        accessor: "exist",
        Cell: (row) => {
          const exist = row.value;
          return (
            <FontAwesomeIcon
              icon={exist ? faCheck : faExclamationTriangle}
            ></FontAwesomeIcon>
          );
        },
      },
      {
        Header: "Audio",
        accessor: "audio_language",
        Cell: (row) => {
          const audio_language = row.value;
          return <span>{audio_language.name}</span>;
        },
      },
      {
        Header: "Languages",
        accessor: "languages",
        Cell: (row) => {
          const { missing_subtitles } = row.row.original;

          // Subtitles
          const languages = row.row.original.languages.map(
            (val: Language, idx: number): JSX.Element => {
              const missing = missing_subtitles.find(
                (item) => item.code2 === val.code2
              );
              return (
                <Badge
                  className="mx-1"
                  key={`${idx}-sub`}
                  variant={missing ? "warning" : "secondary"}
                >
                  {val.code2}
                </Badge>
              );
            }
          );

          return languages;
        },
      },
      {
        Header: "HI",
        accessor: "hearing_impaired",
        Cell: (row) => {
          return <BooleanIndicator value={row.value}></BooleanIndicator>;
        },
      },
      {
        Header: "Forced",
        accessor: "forced",
        Cell: (row) => {
          return <BooleanIndicator value={row.value}></BooleanIndicator>;
        },
      },
      {
        accessor: "radarrId",
        Cell: (row) => (
          <ActionIcon
            icon={faWrench}
            onClick={(e) =>
              onOpenMovieEditor && onOpenMovieEditor(row.row.original)
            }
          ></ActionIcon>
        ),
      },
    ],
    [onOpenMovieEditor]
  );

  return (
    <AsyncStateOverlay state={movies}>
      <BasicTable
        emptyText="No Movies Found"
        options={{ columns, data: movies.items }}
      ></BasicTable>
    </AsyncStateOverlay>
  );
};

export default connect(mapStateToProps)(Table);
