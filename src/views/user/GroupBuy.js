import React, { useState, useEffect } from "react";
import FilterableProducts from "../../components/search/FilterableProducts";
import { useRequest } from "../../hooks/useRequest";
import styled from "styled-components";

const GroupBuyStyle = styled.div`
  padding: 60px 0;
`;

const GroupBuy = () => {
  const [fetchCategories] = useRequest();
  const [fetchBrands] = useRequest();
  const [fetchProducts, { isLoading: isFetchingProducts, state: products }] =
    useRequest();
  const [categoriesData, setCategoriesData] = useState([]);
  const [brandsData, setBrandsData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    (async function () {
      const categoryData = await fetchCategories({
        path: `/category?limit=100&page=1`,
      });
      const brandData = await fetchBrands({
        path: `/brand?limit=100&page=1`,
      });
      setCategoriesData(categoryData?.data?.docs);
      setBrandsData(brandData?.data?.docs);
    })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchProducts({ path: `/product/groupby?limit=16&page=${pageNumber}` });
  }, [pageNumber]);

  const handlePaginationChange = (e, value) => {
    setPageNumber(value);
  };

  return (
    <GroupBuyStyle>
      <div className="container">
        <FilterableProducts
          products={products}
          isFetchingProducts={isFetchingProducts}
          categoriesData={categoriesData}
          brandsData={brandsData}
          title="Group Buy Products"
          handlePaginationChange={handlePaginationChange}
        />
      </div>
    </GroupBuyStyle>
  );
};

export default GroupBuy;
