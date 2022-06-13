import {useContract} from './useContract';
import ProjectAbi from '../contracts/Project.json';
import ProjectAddress from '../contracts/ProjectAddress.json';


// export interface for NFT contract
export const useMinterContract = () => useContract(ProjectAbi.abi, ProjectAddress.Project);