import { useContractKit } from "@celo-tools/use-contractkit";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import AddNfts from "./Add";
import Nft from "./Card";
import Loader from "../../ui/Loader";
import { NotificationSuccess, NotificationError } from "../../ui/Notifications";
import {
  getProjects,
  fundProject,
  pushBackToMarket,
  createProject,
  fetchNftContractOwner,
} from "../../../utils/minter";
import { Row } from "react-bootstrap";

const NftList = ({ minterContract, name }) => {
  /* performActions : used to run smart contract interactions in order
   *  address : fetch the address of the connected wallet
   */
  const { performActions, address, kit } = useContractKit();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nftOwner, setNftOwner] = useState(null);
  const { defaultAccount } = kit;
  const getAssets = useCallback(async () => {
    try {
      setLoading(true);

      // fetch all nfts from the smart contract
      const allProjects = await getProjects(minterContract);
      if (!allProjects) return;
      setProjects(allProjects);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [minterContract]);

  const create = async (data) => {
    try {
      setLoading(true);

      // create an nft functionality
      await createProject(minterContract, performActions, data);
      toast(<NotificationSuccess text="Updating NFT list...." />);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create an NFT." />);
    } finally {
      setLoading(false);
    }
  };

  const fund = async (index, tokenId) => {
    try {
      setLoading(true);
      await fundProject(minterContract, index, tokenId, performActions);
      getAssets();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const backToMarket = async (index) => {
    try {
      setLoading(true);
      await pushBackToMarket(minterContract, index, performActions);
      getAssets();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  const fetchContractOwner = useCallback(async (minterContract) => {
    // get the address that deployed the NFT contract
    const _address = await fetchNftContractOwner(minterContract);
    setNftOwner(_address);
  }, []);

  useEffect(() => {
    try {
      if (address && minterContract) {
        getAssets();
        fetchContractOwner(minterContract);
      }
    } catch (error) {
      console.log({ error });
    }
  }, [minterContract, address, getAssets, fetchContractOwner]);
  if (address) {
    return (
      <>
      {console.log(nftOwner, address)}
        {!loading ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fs-4 fw-bold mb-0">{name}</h1>

              {nftOwner === address ? (
                <AddNfts save={create} address={address} />
              ) : null}
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
              {/* display all NFTs */}
              {projects.map((project) => (
                <Nft
                  key={project.index}
                  account={defaultAccount}
                  contractOwner={nftOwner}
                  fundProject={() => fund(project.index, project.tokenId)}
                  backToMarket={() => backToMarket(project.tokenId)}
                  project={{
                    ...project,
                  }}
                />
              ))}
            </Row>
          </>
        ) : (
          <Loader />
        )}
      </>
    );
  }
  return null;
};

NftList.propTypes = {
  // props passed into this component
  minterContract: PropTypes.instanceOf(Object),
  updateBalance: PropTypes.func.isRequired,
};

NftList.defaultProps = {
  minterContract: null,
};

export default NftList;
