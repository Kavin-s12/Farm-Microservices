import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({ pages, page, isAdmin = false, keyword }) => {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((no) => (
          <LinkContainer
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/pageNumber/${no + 1}`
                  : `/pageNumber/${no + 1}`
                : `/admin/productslist/${no + 1}`
            }
            key={no + 1}
          >
            <Pagination.Item active={no + 1 === page}>{no + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
