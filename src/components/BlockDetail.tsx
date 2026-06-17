import { CausesBlock, AgeBlock, EmployBlock, NosoBlock } from './blocks/PopulationBlocks';
import { PrimaryBlock, FormBlock, ResultBlock, AppealBlock, TermsBlock } from './blocks/ExamBlocks';
import { IssuedBlock, BudgetBlock, GroupsBlock } from './blocks/TsrBlocks';

const BLOCKS = {
  causes: CausesBlock,
  age: AgeBlock,
  employ: EmployBlock,
  noso: NosoBlock,
  primary: PrimaryBlock,
  form: FormBlock,
  result: ResultBlock,
  appeal: AppealBlock,
  terms: TermsBlock,
  issued: IssuedBlock,
  budget: BudgetBlock,
  groups: GroupsBlock,
};

export default function BlockDetail({ block }) {
  const Block = BLOCKS[block];
  if (!Block) return <div>Нет данных</div>;
  return <Block />;
}
