import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CategoryCard from "../../components/category/CategoryCard";
import { useRequest } from "../../hooks/useRequest";
import { Skeleton } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import GroupBuyGrid from "../../components/common/GroupBuyGrid";
import FilterableProducts from "../../components/search/FilterableProducts";
import { useAppContext } from "../../context/useAppContext";

const CategoryStyle = styled.div`
  .categories {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
    padding: 70px 0;
  }
  .products__related {
    padding: 50px 0;
  }
  @media (max-width: 768px) {
    .categories {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      padding: 40px 0;
    }
    .products__related {
      padding: 30px 0 50px;
    }
  }
`;

const Search = ({
  showCategory = true,
  showProducts = true,
  showRelated = true,
}) => {
  const { categoriesData: contextCategories } = useAppContext();
  const [categoriesData, setCategoriesData] = useState([]);
  const [brandsData, setBrandsData] = useState([]);
  const [fetchCategories, { isLoading: isFetchingCategories }] = useRequest();
  const [fetchBrands] = useRequest();
  const { search } = useLocation();
  const navigate = useNavigate();
  const [categoriesIdList, setCategoriesIdList] = useState();
  const searchParams = new URLSearchParams(search);


  useEffect(() => {
    (async function () {
      const categoryData = await fetchCategories({
        path: `/category/categories/json-tree`,
      });
      const brandData = await fetchBrands({
        path: `/brand?limit=100&page=1`,
      });

      setCategoriesData(categoryData?.data);
      setBrandsData(brandData?.data?.docs);
    })();
    // eslint-disable-next-line
  }, []);

  const handleCategoryClick = (item) => {
    if (!categoriesIdList?.includes(item?._id)) {
      searchParams.append("categories[]", item?._id);
      const newUrl = `/search/?${searchParams.toString()}`;
      navigate(newUrl);
    }
  };

  return (
    <CategoryStyle className="container">
      {showCategory && (
        <div className="categories">
          {isFetchingCategories ? (
            <>
              {Array.from({ length: 4 }, (_, index) => index + 1)?.map(
                (item) => (
                  <Skeleton
                    key={item}
                    variant="rectangular"
                    height={130}
                    style={{ borderRadius: "7.5px" }}
                  />
                )
              )}
            </>
          ) : (
            <>
              {contextCategories?.data?.docs?.map((item) => (
                <CategoryCard
                  key={item?.id}
                  bannerUrl={item?.bannerUrl}
                  name={item?.name}
                  type={"text-in-image"}
                  onClick={() => handleCategoryClick(item)}
                />
              ))}
            </>
          )}
        </div>
      )}
      {showProducts && (
        <FilterableProducts
          categoriesData={categoriesData}
          brandsData={brandsData}
          setCategoriesList={setCategoriesIdList}
        />
      )}
      {showRelated && (
        <div className="products__related">
          <GroupBuyGrid />
        </div>
      )}
    </CategoryStyle>
  );
};

export default Search;
