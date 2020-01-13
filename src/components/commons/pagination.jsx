import React from "react";
import _ from "lodash";
//import PropTypes from "prop-types";
const Pagination = ({ pageSize, itemsCount, onPageChange, currentPage }) => {
  const pagesCount = Math.ceil(itemsCount / pageSize);
  if (pagesCount === 1) return null;
  const pages = _.range(1, pagesCount + 1);
  return (
    <nav>
      <ul className="pagination">
        {pages.map(page => (
          <li
            key={page}
            className={page === currentPage ? "page-item active" : "page-item"}
          >
            <a className="page-link" onClick={() => onPageChange(page)}>
              {page}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
// Pagination.PropTypes = {
//   pageSize: propTypes.number.isRequired,
//   itemsCount: propTypes.number.isRequired,
//   onPageChange: propTypes.function.isRequired,
//   currentPage: propTypes.number.isRequired
// };

export default Pagination;
